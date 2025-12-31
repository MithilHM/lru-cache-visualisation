#include <stdio.h>
#include <stdlib.h>

/* 
 * LRU Cache Implementation in C
 * Using a Doubly Linked List for O(1) insertion/deletion
 * and a simple array-based simulation for lookup
 */

// Node structure for Doubly Linked List
typedef struct Node {
    int key;
    int value;
    struct Node *prev, *next;
} Node;

// LRU Cache structure
typedef struct {
    int capacity;
    int size;
    Node *head; // Dummy head (Most Recently Used)
    Node *tail; // Dummy tail (Least Recently Used)
    // In a production C implementation, we'd use a real Hash Map here.
    // For this lab demonstration, we will manage the list directly.
} LRUCache;

// Function to create a new node
Node* createNode(int key, int value) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->key = key;
    newNode->value = value;
    newNode->prev = newNode->next = NULL;
    return newNode;
}

// Function to initialize the cache
LRUCache* initCache(int capacity) {
    LRUCache* cache = (LRUCache*)malloc(sizeof(LRUCache));
    cache->capacity = capacity;
    cache->size = 0;
    
    // Initialize dummy head and tail
    cache->head = createNode(-1, -1);
    cache->tail = createNode(-1, -1);
    cache->head->next = cache->tail;
    cache->tail->prev = cache->head;
    
    return cache;
}

// Internal: Remove a node from the list
void removeNode(Node* node) {
    node->prev->next = node->next;
    node->next->prev = node->prev;
}

// Internal: Add a node right after the head (MRU position)
void addToHead(LRUCache* cache, Node* node) {
    node->next = cache->head->next;
    node->prev = cache->head;
    cache->head->next->prev = node;
    cache->head->next = node;
}

// Internal: Move an existing node to the head
void moveToHead(LRUCache* cache, Node* node) {
    removeNode(node);
    addToHead(cache, node);
}

// Internal: Remove the Least Recently Used node (before the dummy tail)
Node* removeTail(LRUCache* cache) {
    Node* lru = cache->tail->prev;
    removeNode(lru);
    return lru;
}

// GET operation
int get(LRUCache* cache, int key) {
    Node* curr = cache->head->next;
    while (curr != cache->tail) {
        if (curr->key == key) {
            moveToHead(cache, curr);
            return curr->value;
        }
        curr = curr->next;
    }
    return -1; // Not found
}

// PUT operation
void put(LRUCache* cache, int key, int value) {
    Node* curr = cache->head->next;
    
    // Check if key already exists
    while (curr != cache->tail) {
        if (curr->key == key) {
            curr->value = value;
            moveToHead(cache, curr);
            printf("Updated key %d with value %d and moved to MRU.\n", key, value);
            return;
        }
        curr = curr->next;
    }
    
    // Key is new
    Node* newNode = createNode(key, value);
    if (cache->size >= cache->capacity) {
        Node* evicted = removeTail(cache);
        printf("Cache Full! Evicted Least Recently Used key: %d (Value: %d)\n", evicted->key, evicted->value);
        free(evicted);
    } else {
        cache->size++;
    }
    
    addToHead(cache, newNode);
    printf("Inserted key %d (Value: %d) into MRU.\n", key, value);
}

// Function to display the current state of the cache
void displayCache(LRUCache* cache) {
    printf("\n--- Current Cache State (MRU -> LRU) ---\n");
    if (cache->size == 0) {
        printf("Cache is empty.\n");
        return;
    }
    
    Node* curr = cache->head->next;
    while (curr != cache->tail) {
        printf("[Key: %d, Val: %d]", curr->key, curr->value);
        if (curr->next != cache->tail) {
            printf(" <-> ");
        }
        curr = curr->next;
    }
    printf("\nCapacity: %d/%d\n", cache->size, cache->capacity);
    printf("----------------------------------------\n");
}

int main() {
    int capacity, choice, key, value;
    
    printf("Enter Cache Capacity: ");
    if (scanf("%d", &capacity) != 1 || capacity <= 0) {
        printf("Invalid capacity. Exiting.\n");
        return 1;
    }
    
    LRUCache* cache = initCache(capacity);
    printf("LRU Cache initialized with capacity %d.\n", capacity);
    
    while (1) {
        printf("\n1. PUT (Insert/Update)\n2. GET (Retrieve)\n3. DISPLAY (View State)\n4. EXIT\n");
        printf("Enter choice: ");
        scanf("%d", &choice);
        
        switch (choice) {
            case 1:
                printf("Enter Key: ");
                scanf("%d", &key);
                printf("Enter Value: ");
                scanf("%d", &value);
                put(cache, key, value);
                break;
            case 2:
                printf("Enter Key to get: ");
                scanf("%d", &key);
                value = get(cache, key);
                if (value != -1)
                    printf("Result: %d (Moved to MRU)\n", value);
                else
                    printf("Result: -1 (Key not found)\n");
                break;
            case 3:
                displayCache(cache);
                break;
            case 4:
                printf("Exiting...\n");
                // In a proper program, we should free all nodes here
                exit(0);
            default:
                printf("Invalid choice!\n");
        }
    }
    
    return 0;
}
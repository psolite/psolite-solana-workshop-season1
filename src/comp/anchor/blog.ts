/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/onchain_blog.json`.
 */
export type OnchainBlog = {
    "address": "FHMvSSY4Ne9j7Zgjcus5VBCtW2yykTQfnTXxiuVYbauX",
    "metadata": {
      "name": "onchainBlog",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "createPost",
        "discriminator": [
          123,
          92,
          184,
          29,
          231,
          24,
          15,
          202
        ],
        "accounts": [
          {
            "name": "post",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    115,
                    111,
                    108,
                    105,
                    116,
                    101
                  ]
                },
                {
                  "kind": "account",
                  "path": "author"
                },
                {
                  "kind": "arg",
                  "path": "timestamp"
                }
              ]
            }
          },
          {
            "name": "author",
            "writable": true,
            "signer": true
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "u64"
          }
        ]
      },
      {
        "name": "deletePost",
        "discriminator": [
          208,
          39,
          67,
          161,
          55,
          13,
          153,
          42
        ],
        "accounts": [
          {
            "name": "post",
            "writable": true
          },
          {
            "name": "author",
            "signer": true,
            "relations": [
              "post"
            ]
          }
        ],
        "args": []
      },
      {
        "name": "editPost",
        "discriminator": [
          218,
          25,
          82,
          105,
          200,
          189,
          238,
          75
        ],
        "accounts": [
          {
            "name": "post",
            "writable": true
          },
          {
            "name": "author",
            "signer": true,
            "relations": [
              "post"
            ]
          }
        ],
        "args": [
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          }
        ]
      },
      {
        "name": "togglePublish",
        "discriminator": [
          115,
          170,
          172,
          43,
          214,
          183,
          220,
          7
        ],
        "accounts": [
          {
            "name": "post",
            "writable": true
          },
          {
            "name": "author",
            "signer": true,
            "relations": [
              "post"
            ]
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "post",
        "discriminator": [
          8,
          147,
          90,
          186,
          185,
          56,
          192,
          150
        ]
      }
    ],
    "types": [
      {
        "name": "post",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "author",
              "type": "pubkey"
            },
            {
              "name": "title",
              "type": "string"
            },
            {
              "name": "content",
              "type": "string"
            },
            {
              "name": "createdAt",
              "type": "i64"
            },
            {
              "name": "updatedAt",
              "type": "i64"
            },
            {
              "name": "isPublished",
              "type": "bool"
            }
          ]
        }
      }
    ]
  };
  
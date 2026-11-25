# Daily assistant

Private page at [warrendaisey.com/assistant/](https://warrendaisey.com/assistant/). It is a static GitHub Pages folder. The briefing is decrypted in the browser. The page never sends mail itself. Send, Mark done, Snooze, and Send note POST a JSON action to the webhook stored inside that briefing.

The page is `noindex,nofollow` and is not linked from the public navigation.

## Try it

- Fictional data, no passphrase: [/assistant/?demo=1](https://warrendaisey.com/assistant/?demo=1) loads `sample.json`.
- Encrypted sample: [/assistant/?enc=sample](https://warrendaisey.com/assistant/?enc=sample) loads `sample.enc.json`. The passphrase is `demo`. That passphrase is for this fake file only. Do not reuse it for a real briefing.
- A real day: `/assistant/` loads `assistant/data.enc.json`. Until that file is published, the gate says the briefing has not arrived.

People and messages in `sample.json` are invented (`example.com` only). Do not put a real person’s mail in the sample.

## Files

| Path | Committed? | Role |
| --- | --- | --- |
| `assistant/index.html` | yes | Page |
| `assistant/assistant.js` | yes | Briefing UI and local state |
| `assistant/assistant.css` | yes | Page styles |
| `assistant/crypto.js` | yes | WebCrypto unlock |
| `assistant/actions.js` | yes | The only module that calls the webhook |
| `assistant/pollinations.js` | yes | Proofread client, same routes and backoff as `/chatbot/chat.js` |
| `assistant/sample.json` | yes | Fictional plaintext for `?demo=1` |
| `assistant/sample.enc.json` | yes | That sample encrypted with passphrase `demo` |
| `assistant/data.enc.json` | when you publish | Today’s real briefing. Not in git until the assistant writes it |
| `assistant/tools/encrypt.mjs` | yes | Encrypt, decrypt, and verify |
| Plaintext `assistant/data.json`, `briefing.json`, `*.dec.json`, `private/` | no | Listed in the repo `.gitignore` |

## Plaintext briefing

UTF-8 JSON. `encrypt.mjs check` and `encrypt` both refuse a file that does not match this shape. Extra fields are ignored by the page. `sample.json` is a full example.

```json
{
  "generated_at": "2026-11-25T12:30:00Z",
  "date": "2026-11-25",
  "config": {
    "action_webhook_url": "https://example.invalid/assistant/actions",
    "action_webhook_key": "demo-webhook-key",
    "action_webhook_header": "X-Assistant-Key"
  },
  "tasks": [],
  "emails": []
}
```

### Top level

| Field | Required | Meaning |
| --- | --- | --- |
| `generated_at` | yes | ISO-8601 timestamp for when the assistant built the file |
| `date` | yes | Briefing day, `YYYY-MM-DD`. Local UI state is stored under this date |
| `config` | yes | Webhook settings. These exist only inside the encrypted file |
| `tasks` | yes | Array, possibly empty |
| `emails` | yes | Array, possibly empty |

### `config`

| Field | Required | Meaning |
| --- | --- | --- |
| `action_webhook_url` | yes | `https://` (or `http://` for a local test) URL that accepts the action POST |
| `action_webhook_key` | yes | Secret sent as the header value. It is not copied into the JSON body |
| `action_webhook_header` | no | Header name. Default `X-Assistant-Key`. A short token: letters, digits, hyphens |

### `tasks[]`

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Stable unique string for this task |
| `title` | yes | Short label |
| `source` | no | Where it came from, such as a course site or a list |
| `due` | no | ISO-8601 datetime, a `YYYY-MM-DD` date, or `null` |
| `priority` | no | `high`, `medium`, or `low`. The page sorts high first |
| `details` | no | Context paragraph |
| `proposed_solution` | no | What the assistant suggests doing |
| `links` | no | `[{ "label": "Example portal", "url": "https://example.com/..." }]`. Only `http` and `https` are opened |
| `actions` | no | Subset of `done`, `snooze`, `copy`, `open`, `note`. Omit the field (or use `[]`) to allow all of them. `open` shows `links` |

### `emails[]`

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Stable unique string |
| `account` | no | Label such as `school` or `personal` |
| `thread_id` | no | Mailbox thread id, echoed on every action |
| `gmail_url` | no | `https` link for “Open in Gmail” |
| `from_name` | no | Sender display name |
| `from_email` | no | Sender address |
| `subject` | no | Subject of the message that needs a reply |
| `received_at` | no | ISO-8601 |
| `snippet` | no | Short quote from the message |
| `why_it_needs_reply` | no | One or two sentences from the assistant |
| `draft_to` | yes | Suggested To |
| `draft_cc` | no | Suggested Cc, one string (comma-separated if there are several) |
| `draft_subject` | yes | Suggested subject |
| `draft_body` | yes | Suggested body. May be an empty string. The page shows it in an editable box |

## Encrypted file

`data.enc.json` and `sample.enc.json` look like this. Salt and IV are random per encryption. Ciphertext is AES-GCM, which includes the auth tag.

```json
{
  "v": 1,
  "alg": "AES-GCM",
  "kdf": "PBKDF2-SHA256",
  "iterations": 600000,
  "salt": "<base64, 16 bytes>",
  "iv": "<base64, 12 bytes>",
  "ciphertext": "<base64>"
}
```

The browser derives a 256-bit AES key with PBKDF2-SHA256 and the iteration count stored in the file (100,000 through 2,000,000). A wrong passphrase fails authentication. The passphrase is not saved.

If “Remember the unlock key in this tab” is checked, the raw AES key is kept in `sessionStorage` under `wd-assistant-session`, tied to that file’s salt and IV. Closing the tab clears it. A new briefing has a new salt, so the saved key no longer matches.

## `encrypt.mjs`

The passphrase is read only from the environment variable `ASSISTANT_PASSPHRASE`. Do not put it in the command line.

```bash
node assistant/tools/encrypt.mjs check briefing.json
ASSISTANT_PASSPHRASE='a long passphrase' node assistant/tools/encrypt.mjs encrypt briefing.json assistant/data.enc.json
ASSISTANT_PASSPHRASE='a long passphrase' node assistant/tools/encrypt.mjs verify assistant/data.enc.json
ASSISTANT_PASSPHRASE='a long passphrase' node assistant/tools/encrypt.mjs decrypt assistant/data.enc.json /tmp/briefing.json
```

- `check` validates plaintext and does not need a passphrase. Exit `0` prints `ok date=… tasks=… emails=…`. Exit `2` prints `error …` lines. Warnings go to stderr and still exit `0`.
- `encrypt` validates, then writes the envelope. The default output path swaps `.json` for `.enc.json`.
- `verify` decrypts in memory, validates, and prints the same `ok` line. It does not print the briefing.
- `decrypt` writes pretty JSON. Use `-` for stdout. Plaintext is written mode `0600`. Do not point it at a path you will commit.

Publish by committing only `assistant/data.enc.json`. Leave the plaintext outside the repo.

## Action POST

`assistant/actions.js` is the only code that calls the webhook. It sends:

```
POST <config.action_webhook_url>
Content-Type: application/json
Accept: application/json
<config.action_webhook_header or X-Assistant-Key>: <config.action_webhook_key>
```

The header value is the key exactly as stored. The page does not add a `Bearer` prefix. The key is not a JSON field.

Body, every time:

```json
{
  "action": "send",
  "item_type": "email",
  "item_id": "email-office-hours",
  "thread_id": "thread-demo-office-hours",
  "account": "school",
  "to": "avery.quill@example.com",
  "cc": "",
  "subject": "Re: Thursday office hours moved",
  "body": "Hi Professor Quill,\n\nFriday at 2 PM works.\n\nWarren Daisey",
  "note": "Please send this after lunch.",
  "client_time": "2026-11-25T07:05:12-05:00"
}
```

| Field | Meaning |
| --- | --- |
| `action` | `send`, `done`, `snooze`, or `note` |
| `item_type` | `task` or `email` |
| `item_id` | The briefing id |
| `thread_id` | Email thread id, or `""` for a task |
| `account` | Email account label, or `""` |
| `to`, `cc`, `subject`, `body` | Edited draft for an email. All `""` for a task |
| `note` | The “Note for my assistant” box. Included on every action, `""` when blank |
| `client_time` | Browser local time, ISO-8601 with the numeric offset |

What each action means:

- `send` — mail this draft. Used for emails. The browser does not contact Gmail.
- `done` — Warren handled it. Stop showing it as open.
- `snooze` — hide it until the next local calendar day after `client_time`. The page does the same hide on this device.
- `note` — store the note and do not change done or snoozed.

Copy, Open in Gmail, Open link, and Proofread stay in the browser and do not POST.

Any HTTP status outside 2xx, a network failure, or a missing URL is a failure. The card stays open and shows **Retry**, which posts again with the current draft and note. The same action can arrive twice if a response is lost. Treat a repeated `send` for the same `item_id` and body as one send.

The endpoint must answer a CORS preflight, because the browser sends `Content-Type: application/json` and a custom header:

```
Access-Control-Allow-Origin: https://warrendaisey.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept, X-Assistant-Key
```

Use the real header name if `action_webhook_header` is not `X-Assistant-Key`. The request uses `credentials: "omit"`.

While a request is in flight the card says “Sending to your assistant…”. Success says it was sent to the assistant (not that the mail already went out). Failure says it did not go through and offers Retry.

## On this device

Edits, notes, and done / snoozed / sent state live in `localStorage` under `wd-assistant:v1:` plus the briefing `date`. Reloading the same briefing keeps them. A new date starts clean. Entries older than 21 days are removed. Snooze lasts until the next local calendar date, then the item is open again on this device even if the briefing date has not changed.

Proofread posts the draft body to Pollinations through `assistant/pollinations.js`, using the same route list, 22-second attempt limit, and 402/429 backoff as `/chatbot/chat.js` (about one fresh reply per 45 seconds per visitor). The revised body replaces the draft. “Undo proofread” restores the previous text. Proofread does not send the email.

## Publishing a real day

1. Write the plaintext JSON somewhere outside the repo.
2. `node assistant/tools/encrypt.mjs check path/to/briefing.json`
3. `ASSISTANT_PASSPHRASE='…' node assistant/tools/encrypt.mjs encrypt path/to/briefing.json assistant/data.enc.json`
4. Commit `assistant/data.enc.json` only.

Use a long passphrase. `demo` exists so the encrypted sample can be opened. It will not unlock a file that was encrypted with something else.

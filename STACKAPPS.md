Voting Overcharged - A userscript for automatically voting on posts depending on various conditions

script voting


<!-- thumbnail:  -->
<!-- version: 1.2.0 -->
<!-- tag: script -->
<!-- excerpt: A userscript for automatically voting on posts depending on various conditions. -->


## About

Voting overcharged allows users to automatically vote on posts upon triggering various conditions.

Inspired by [Why does accepting answers not automatically upvote them?](https://meta.stackoverflow.com/q/422246).

Current version includes:

| Feature                                                | Default  |
| ------------------------------------------------------ | -------- |
| Auto upvoting the answer upon accepting it             | enabled  |
| Auto downvoting the question upon voting to close      | disabled |
| Auto upvoting the question upon upvoting an answer     | disabled |
| Auto downvoting the question upon downvoting an answer | disabled |

This is a "living" project, so the feature set is likely to be expanded upon in future versions.

The userscript uses the [shared configurer](https://stackapps.com/q/9403/78873) for UserScripters projects as a peer dependency.
Please install it if you want to be able to change the default settings (since v2.0.0, settings are stored in the script's storage, and central storage is used as a fallback mechanism).

Changes made to settings when using the configurer are *live* and do not require the page to be reloaded.

### License

The script is licensed under the [GPL-3.0-or-later](https://spdx.org/licenses/GPL-3.0-or-later) license.

### Download

Latest version: 1.2.0

[Install](https://github.com/userscripters/voting-overcharged/raw/master/dist/modern/index.user.js) | [Minified](https://github.com/userscripters/voting-overcharged/raw/master/dist/modern/index.min.user.js)


### Platform

Version number means "last tested on":

| Chrome | Edge | Explorer | Firefox | Opera |
| - | - | - | - | - |
| ✔ 108.0.5359.124 | - | - | - | - |

## Change log

| Version    | Description |
| ---------- | ----------- |
| 1.2.0 |             |

## Contact

Author: Oleg Valter
<br>Organization: [UserScripters](https://github.com/userscripters)

Please, submit bug reports [on the source repository](https://github.com/userscripters/voting-overcharged/issues).
<br>Before adding a new one, please check if it hasn't been raised before.

You can also [drop by to chat](https://chat.stackoverflow.com/rooms/214345), we are a friendly bunch.

## Code

[Source code](https://github.com/userscripters/voting-overcharged/blob/master/src/index.ts) is written in TypeScript.

Contributions are welcome, you can always [submit a PR here](https://github.com/userscripters/voting-overcharged/pulls).
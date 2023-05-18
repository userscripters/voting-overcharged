
# About

| Author       | Oleg Valter<br>[oleg.a.valter@gmail.com](mailto:oleg.a.valter@gmail.com) |
| :----------- | :----------------------- |
| Name | @userscripters/voting-overcharged |
| Description | A userscript for automatically voting on posts depending on various conditions |
| License | [GPL-3.0-or-later](https://spdx.org/licenses/GPL-3.0-or-later) |
| Version | 1.2.0 |

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

# Support

Bug reports for the project should be [submitted here](https://github.com/userscripters/voting-overcharged/issues).
<br>Before adding a new one, please check if it hasn't been raised before.
  
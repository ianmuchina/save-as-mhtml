# mhtml-bookmark

Simple chrome extension to save page as .mhtml in one click.

## Bugs

- Only works on latest chrome
- Not compatible with ublock origin cosmetic filters. ie: cookie consents in saved output.
- Has visual bugs if js-heavy sites

## usage
- go to options and click button to allow permissions.

state indicators
- options page


flow

1. (initial load) no handle, no permissions -> 2 user interactions.
2. (load website) valid handle, no permissions.

Could add fallback cache.
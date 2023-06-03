if special_match(){
    callback(tab)
} else if match() {
    save_mhtml()
    persist_json()
} else {
    log()
}

if referrer.matches hackernews, bookmark it
if referrer is blog site like medium, reader mode then save.


## Levels
in-browser-processing:
- Url matching Lighweight matches.
post-processing:
- code that requires cpu or needs a server to work.

for each jpg image in mhtml, replace with avif


## bookmarks overhaul

Make the bookmarks page better


## Tasks
extension icons for all bookmark states
Offline index that uses the `file:///` namespace and is stored alongside bookmarks

states: 

### Global
1: HasPermisson: Boolean

- Required for extension to make sense
- Can't persist new links.
- Can't query local data.
- Can't hyperlink to file:// uris
- Mitgation: have OPFS that works incase user clicks.

### Per Tab: 

Bookmarked
Not Bookmarked
Error


# Workflow

Open Page

## Logic

Have list of hosts/url matches that should be automatically archived as is. eg: Medium.com post
Have list of hosts/urls that should be specially archived in-browser. eg: Stack overflow post + it's api
Have list of hosts/urls that should be externally bookmarked: eg: Youtube

## Custom rules/scripts

- Video:
  - Download. Skip big videos / ask for user input
  - How to link?? base64 may be too big. Check if compression works
- Images: 
- Audio
- Iframes:
  - Github gist
  - Twitter post

- Mastodon thread
- Mastodon post
- 

## Metadata

```yaml
# Site
host: url
favicon: image
# Page
title: string
description: string
opengraph:
  
date_archived: number
mhtml: []byte
thumbnail: Image
tags: []string # Manual Tags
collections: []string
notes: []string
auto_tags: [] # Uses NLP for tagging
hackernews_link: string
```

## Views

Settings/Options page
Popup Page for quick editing
Side panel for general editing/usage.

## Research 

Have data to check if host is trusted.
How does IFTT work.
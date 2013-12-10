Super-Simple-S3Paste
====================

A simple, entirely client-side, paste-site using s3.

It's running at [paste.esk.io](http://paste.esk.io) right now, and for the
forseeable future.

## Notes


### Idea

The driving idea behind this was to have a simple pastebin-like site that
had no servers involved. It's kind of a proof of concept of using the AWS
client-side api as the entire backend.

### Overwriting

One interesting ramification of this is that other users can overwrite your
pastes by default. The solution I came up with for that was to enable
versioning in the s3 bucket of pastes, and then include the versionid in
the paste get. You can't overwrite a key+versionid pair, only a key, so
I believe this entirely resolves that problem.

### Abuse

This required read/write credentials (didn't want to force login for
the more secure credential option) to be visible to all clients. I even
included them in this repo for now. In order to limit abuse, I think I'll
also write a program that deletes all non-plaintext files and all files
larger than 10M. This won't prevent abuse, but it will make storing large
files on my dime less useful since they'll vanish randomly.


##Todo

I plan to do the following as well:

* Add a view.html?id= page.
* Add syntax highlighting saved as an id-meta file in addition to the paste.
* See if I can exclude the versionid from the view.html page by ensuring view
defaults to the earliest version anyways, and that there's only one version of
each id that matters ever
* Create a generic file host in addition to text host using the exact same idea


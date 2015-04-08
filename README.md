# paperless
A project to help me go paperless

App to go paperless.
Backend using Flask. Connects to local scanner and gives access to:
- scan?resolution (to temp file. redirects to view)
- view?id (view temp file)
- delete?id  (delete temp file)
- save?id (save in spideroak directory. if not path, to incoming)
- add?id&file (add id to file (pdf). If no file, generate and return)

Frontend having multiple tabs:
 - config (set API ip, resolution)
 - scan page
   - scan button(75 dpi)
   - preview image
   - delete button
   - save button (rescan with configured dpi)
   - add button (to scan another page and add it to a pdf)
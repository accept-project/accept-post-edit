accept-post-edit
================

Overview
========

API side:

- Create an Edition project and Upload Data from a Web page by blocks or segments of text that get unique ID’s.

Client side:

It is setup in order to know where to find the unique ID’s
When those elements are clicked and external windows is displayed and the user can perform the edition.
All changes are being recorded in the background and can be automatically brought live by the underlying system depending on the pipeline workflow.

Data Edition API allows you to edit Web content on the fly, what happens with the change can later be decided.

- Again: relatively straightforward to implement since its JavaScript based.

- The entire content of a given HTML page can be grouped within an Edition project.

- The client (that is completely invisible for the user) – on certain event (on-click for example) over a configured element it (the client) will identify (using the hidden attribute/element)  the HTML data it should load and display the content within a dialog box.

- All editions history is being recorded, as well as all keystrokes and timings performing edition.

- Collaborative edition is allowed.

Relatively straightforward and non intrusive integration (+ CSS inheritance).  




Note:
=====
More documentation soon.

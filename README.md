accept-post-edit
================

Overview
========


Configuration Steps:
====================

API side:

1 - The first step is to create an Edition project and then Upload some content into it. 
2 - Once the project is created, content for edition can be uploaded, the expected format is JSON and the structure can be:

'''json
{
  "MtContactEmail": "", 
  "MtDate": "2013-08-28T10:28:25.772468", 
  "MtTool": "tb", 
  "MtToolId": "accept.statmt.org/demo/translate.php", 
  "SourceLanguage": "fr", 
  "TargetLanguage": "en", 
  "src_sentences": [
    {
      "text": "ACCEPT est un projet collaboratif STREP, qui a pour but de développer de nouvelles méthodes et techniques visant à améliorer la traduction automatique (TA) dans le cadre des communautés Internet partageant des informations spécialisées."
    }, 
    {
      "text": "De nos jours, n'importe qui peut, en théorie, créer et partager des informations avec le reste du monde grâce à Internet."
    }, 
    {
      "text": "Et pourtant la barrière linguistique est toujours là: même si l'information est disponible, elle n'est disponible que pour ceux qui parlent la langue dans laquelle elle a été écrite."
    }, 
    {
      "text": "La mission d'ACCEPT est d'aider les communautés à partager leurs informations de manière plus efficace malgré la barrière linguistique, en améliorant la qualité du contenu communautaire traduit par un outil automatique."
    }, 
    {
      "text": "Vous voulez en savoir plus?"
    }
  ], 
  "text_id": "212cjwnn312312njksdqd3n", 
  "tgt_sentences": [
    {
      "text": "Accept is a collaborative project STREP, which aims to develop new methods and techniques aimed to improve the translation automatic (ITA) in the framework of the communities specialised Internet sharing information."
    }, 
    {
      "text": "Nowadays, anyone can, in theory, creating and share information with the rest of the world through the Internet."
    }, 
    {
      "text": "And yet the language barrier is still there: Even if the information is available, it is only available for those who speak the language in which it has been written."
    }, 
    {
      "text": "The mission of ACCEPT is to help the communities to share their information more effectively despite the language barrier, by improving the quality of the content of Community translated by an automatic tool."
    }, 
    {
      "text": "You want to know more?"
    }
  ]
}

'''

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

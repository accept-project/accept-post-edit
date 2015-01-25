accept-post-edit
================

Overview
========

The data Edition API allows you to edit Web content on the fly, what happens with the change can later be retrieved.

##High level features:

- Relatively straightforward to implement since its JavaScript based.

- The entire content of a given HTML page can be grouped within an Edition project.

- The client (that is completely invisible for the user) – on certain event (on-click for example) over a configured element it (the client) will identify (using the hidden attribute/element)  the HTML data it should load and display the content within a dialog box.

- All editions history is being recorded, as well as all keystrokes and timings performing edition.

- Collaborative edition is allowed.

- Relatively straightforward and non intrusive integration (+ CSS inheritance).  

Configuration Steps:
====================

##API/Portal side:

Note: the steps below can be performed from the ACCEPT Portal UI or using directly the REST API methods. 

1 - The first step is to create an Edition project and then Upload some content into it. 

2 - Once the project is created, content for edition can be uploaded, the expected format is JSON and the structure can be:

```json
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
```

3 - The content Edition itself can happen within the ACCEPT Portal(.../ProjectDetail page) or via external environment integration - which means in practice take the client and deploy it elsewhere. 

In both situations there must be an implementation of the Post-Edit client, in the portal it is ready for use, so basically every time a JSON file is uploaded via API or Portal UI it is transformed in a Post-Edition Task and displayed within the "ProjectDetails" page. 

In this page users invited to participate in the project will see displayed all the uploaded JSON content in a form of Edition Tasks. Once one is clicked the external pop up dialog should be displayed with the content ready for edit.

If the content is planned to be edited within an external environment(let's say the Amazon Mechanical Turk for instance), then a few more steps are needed - check the Client side implementation section.


##Client side:

Note: if the content edition is planned to be happening outside the ACCEPT Portal, then the Post edit client needs to be downloaded and integrated within the target environment.

```html
<div id="post-edit-placeholder">

<div class="edit-me" title="a50ecdcaa123321sdasdas55e72e9b0_proj134">
<div class="userContainer" style="display:none" title="david_luz@sapo.pt"></div>Content to edit.</div>

<div class="edit-me" title="b8267f63441baff82edeee287b7b9d737291798bd38ab76881002eaa48bd36c15d3fb7747c9c27102c23bcfd83e0278fbdf9db37506ccd3b2883ee0741a4797e_proj134">
<div class="userContainer" style="display:none" title="david_luz@sapo.pt"></div>More content to edit.</div>

<div class="edit-me" title="f1b180a8db51ddddd3bc6_proj134">
<div class="userContainer" style="display:none" title="david_luz@sapo.pt"></div>Even more content to edit</div>

</div>
```

It is setup in order to know where to find the unique ID’s
When those elements are clicked and external windows is displayed and the user can perform the edition.
All changes are being recorded in the background and can be automatically brought live by the underlying system depending on the pipeline workflow.

Note:
=====
More documentation soon.

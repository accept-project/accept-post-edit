accept-post-edit
================

####Overview

The data Edition API allows to edit Web content on the fly, what happens with the change can later be retrieved.
All editions are being recorded in the background and can be automatically brought live by any underlying system: with a proper pipeline workflow in place.

Full documentation available in the [docs repository](https://github.com/accept-project/accept-docs/tree/master/post-edit).

#####High level features:

- Relatively straightforward to implement since its JavaScript based.

- The entire content of a given HTML page can be grouped within an Edition project.

- The client (that is completely invisible for the user) – on certain event (on-click for example) over a configured element it (the client) will identify (using the hidden attribute/element)  the HTML data it should load and display the content within a dialog box.

- All editions history is being recorded, as well as all keystrokes and timings performing edition.

- Collaborative edition is allowed.

- Relatively straightforward and non intrusive integration (+ CSS inheritance).  

####Understanding the Portal
+Information available [here](https://github.com/accept-project/accept-docs/blob/master/post-edit/portal.rst)

####Creating a Project
+Information available [here](https://github.com/accept-project/accept-docs/blob/master/post-edit/portal/project_creation.rst).

####Project Data
+Information available [here](https://github.com/accept-project/accept-docs/blob/master/post-edit/portal/project_data.rst).

####Adding Data/Tasks to Projects
+Information available [here](https://github.com/accept-project/accept-docs/blob/master/post-edit/portal/project_task.rst).

####Getting Project Info
+Information available [here](https://github.com/accept-project/accept-docs/blob/master/post-edit/api/project_info.rst).

####Getting Project Status
+Information available [here](https://github.com/accept-project/accept-docs/blob/master/post-edit/api/project_status.rst).

####Getting Task Status
+Information available [here](https://github.com/accept-project/accept-docs/blob/master/post-edit/api/project_task.rst).

####Adding Users to Projects
+Information available [here](https://github.com/accept-project/accept-docs/blob/master/post-edit/api/project_users.rst).

####External Projects
+Information available [here](https://github.com/accept-project/accept-docs/blob/master/post-edit/external_project.rst).

####Configuration Steps:

In order to make proper use of the ACCEPT Post-Edit environment some prior configuration is needed. 
This configuration steps can be splitted in two categories, the API/Portal side configuration and the Client side(jQuery plug-in) configuration. 

There are some configuration steps for both sides:

#####API/Portal side:

######Note: the steps below can be performed from the ACCEPT Portal UI or using directly the REST API methods. 

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

If the content is planned to be edited within an external environment(let's say the Amazon Mechanical Turk for instance), then a few more steps are needed - check next steps for the Client side implementation section.


####Client Side:

The "Client Side" refers specifically to the jQuery plug-in available in this repository.

######Note: if the content edition is planned to be happening outside the ACCEPT Portal, then the Post edit client source needs to be downloaded and integrated within the target(Web) environment.

- To keep in mind is that the JavaScript client needs to be "pointed at" some specific HTML structure, for instance:

```html
<div id="post-edit-placeholder">

<div class="edit-me" title="TEXTID_OF_THE_UPLOADED_TASK_I_proj134">
<div class="userContainer" style="display:none" title="david@somewhere.com"></div>Content to edit.</div>

<div class="edit-me" title="TEXTID_OF_THE_UPLOADED_TASK_II_proj134">
<div class="userContainer" style="display:none" title="david@somewhere.com"></div>More content to edit.</div>

<div class="edit-me" title="TEXTID_OF_THE_UPLOADED_TASK_IIII_proj134">
<div class="userContainer" style="display:none" title="david@somewhere.com"></div>Even more content to edit</div>

</div>
```
The structure of the HTML will dictate which content can be edited and who can perform the edition. Within the  [Examples](https://github.com/accept-project/accept-post-edit/tree/master/examples "Examples") folder it is possible to read more on the expected HTML striucture and the client instantiation.

######Note: More information on client attributes initialization can be found [here](https://github.com/accept-project/accept-docs/blob/master/post-edit/plugin/configuration.rst).

##Support Contact
Any issue/question on the ACCEPT Post-Edit plug-in can be posted [here](https://github.com/accept-project/accept-post-edit/issues).
Or contact me directly via davidluzsilva@gmail.com

####Citing

If you use the ACCEPT Post-Editing environment in your research work, please cite:

Roturier, J., Mitchell, L., Silva, D. (2013). The ACCEPT post-editing environment: A flexible and customisable online tool to perform and analyse machine translation post-editing. In Proceedings of MT Summit XIV Workshop on Post-editing Technology and Practice, pp. 119-128, Nice, France, September. ([Bib file](https://raw.githubusercontent.com/accept-project/accept-post-edit/master/cite.bib))

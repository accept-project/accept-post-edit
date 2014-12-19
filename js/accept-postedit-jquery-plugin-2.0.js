/**********************************************************************************************************************************************/
/*  ACCEPT PROJECT - http://www.accept.unige.ch/index.html or http://cordis.europa.eu/fp7/ict/language-technologies/project-accept_en.html    */
/*  Post-Editing Plug-in (version 2.0)                                                                                                         */
/*  David Silva - davidluzsilva@gmail.com                                                                                                     */
/*                                                                                                                                            */
/**********************************************************************************************************************************************/

(function ($) {

    //post-edit plug-in core.
    $.fn.AcceptPostEdit = function (options) {

        //core variables.
        var thisObject = $(this);
        var contentObj = null;
        var translationUnitsPool = [];
        var globalCurrentTranslationUnitIndex = 1;
        var globalPreviousTranslationUnitIndex = 1;
        var isNewPhaseCreatedForThisRevision = false;
        var isNewThinkingPhaseCreatedForThisRevision = false;

        var startPePhase = null;
        var shift = false;
        var newh = 0;
        var neww = 0;
        var oldh = 0;
        var oldw = 0;

        var labelCloseDialog = 'Save For Later';
        var labelGuideLines = 'Guidelines';
        var labelUserAllSelected = 'Complete Task';
        var labelInteractiveCheck = 'Trigger Interactive Check';
        var labelTranslationOptions = 'Use Translation Options';
        var labelParaphrasingService = 'Use Paraphrasing Service';

        //maximization helpers.
        var startW = 0;
        var startH = 0;
        var endW = 0;
        var endH = 0;

        //paraphrasing.
        $.paraifrx = 0;
        $.paraifry = 0;
        var $paraContainer = null;
        var $paraiframe = null;
        var paraphrasingLanguage = "en";
        var maxResults = 5;
        var paraSystemId = "";
        var isParaphrasingEnabled = false;
        var postEditHub = null;
        var paraphrasingSelectionTimestamp = null;
        var paraphrasingSelection = "";

        //interactive check.
        var isInteractiveCheckEnabled = false;
        var interactiveCheckRuleSet = "";
        var interactiveCheckLanguage = "en";
        var $iframe = null;
        var $head = null;
        var $allContainers = null;
        var interactiveCheckMenuDisplayTimeStamp = null;

        //external variables.
     
        //external labels.
        $.labelEmptySegment = "[...]";
        $.labelEdit = "Edit";
        $.labelHelp = "Help";
        $.labelPreEditTitle = "Check Spelling, Grammar and Style";
        $.labelClickOntextToEdit = "Click on text to Edit:";
        $.htmlDialogHelp = "<p>This window has two parts: on the left hand-side, you can find a machine-translated text, which contains multiple sentences."
		+ "Each of these sentences may be improved with your edits.</p><p>On the right hand-side, the “Current sentence to edit” box allows you to edit a machine-translated sentence, "
		+ "by following the guidelines that are made available to you via the “Guidelines” button. "
		+ "There are two buttons above the Edit box: an Undo button and a Redo button.</p>"
		+ "<p>These buttons will have an impact on the sentence that you are currently editing. For each sentence, you are free to add comments in the “Comments” box, "
		+ "but this is purely optional! And do not worry about saving your changes or comments, this happens automatically! You can navigate from one sentence to another in three ways: you can either "
		+ "click on any sentence on the left hand-side, use the “Prev” and “Next” buttons or use the TAB and SHIFT+ TAB shortcuts to move one sentence at a time.</p><p>If you would like to take a break, click “Save for Later” "
		+ "so that you can continue your activity the next time you open the task. When you no longer have any edits or comments to make, click “Complete Task”. If you encounter any problem, contact your project administrator.</p>";

        $.labelPrev = "Prev (Shift+Tab)";
        $.labelNext = "Next (Tab)";
        $.labelGuidelinesTitle = "Guidelines";
        $.htmlBilingualGuidelines = '<h4>Guidelines for <span id="guideLinesTranslationType_" >Bilingual</span> post‐editing:</h4>' +
         '<p>Try to improve the target text by:</p>' +
        '<ul>' +
        '<li> Ensuring that the meaning of the source sentence is preserved</li>' +
        '<li> Ensuring that no information has been accidentally added or omitted</li>' +
        '<li> Using as much of the translation suggestions as possible</li>' +
        '<li> Applying standard rules regarding spelling and grammar</li>' +
        '<li> Remembering that there is no need to implement corrections that are of a stylistic nature only </li>' +
       '<li> Remembering that there is no need to restructure sentences solely to improve the natural flow of the text </li>' +
       '</ul>';

        $.htmlGuidelinesMonolingual = '<h4>Guidelines for <span id="guideLinesTranslationType_" >Monolingual</span> post‐editing:</h4>' +
         '<p>Try to improve the target text by:</p>' +
         '<ul>' +
         '<li> Ensuring that no information is inaccurate</li>' +
         '<li> Using as much of the translation suggestions as possible</li>' +
         '<li> Applying standard rules regarding spelling and grammar</li>' +
         '<li> Remembering that there is no need to implement corrections that are of a stylistic nature only </li>' +
        '<li> Remembering that there is no need to restructure sentences solely to improve the natural flow of the text </li>' +
        '</ul>';

        $.labelQuickQuestionTitle = "Quick Question";
        $.labelConfirmationNeeded = "Confirmation needed";
        $.labelConfirmationText = "This action will finish your edition, are you sure?";
        $.labelQuickAnswerDone = "Done";
        $.labelConfirmationYes = "Yes";
        $.labelConfirmationNo = "No";
        $.labelCurrentSentenceToEdit = "Current sentence to edit:";
        $.labelTargetTextTitle = "Target Text";
        $.labelSourceTextTitle = "Source Text";
        $.labelComments = "Comments ?";
        $.labelCommentsTitle = "Comments";
        $.labelOriginalSentence = "Original sentence:";
        $.userBrowser = null;
        $.AcceptTinyMceEditor = null;
        $.textId = "";
        $.currentUserId = "";
        $.jobId = "";
        $.tool = "ACCEPT Portal";
        $.tooldId = "0.9";
        $.targetLanguage = "";
        $.question = "";
        $.questionId = "";
        $.configurationId = "";
        $.processName = "bilingual";
        $.globalStartTime = null;
        $.globalEndTime = null;
        $.editOptions = [];
        $.displayTranslationOptions = true;
        $.customInterface = 0;
        $.lockCustomInterfacePhaseCreation = true;
        $.globalThinkPhaseInitTime = null;
        $.labelShowSource = "Show Source";
        $.labelHideSource = "Hide Source";
        $.blockedDocumentMessage = "Document blocked.";
        $.isSingleRevision = false;
        $.projectMaxThreshold = "";
        $.messageDocBlock = "You have been working on this task for at least @timespan@ which was defined by your project administrator as the maximum amount of time a task could be locked for by a single user. Well done! <br /><br /> This task has now been claimed by another user. If you would like to contribute more, please wait for this user to be finished before opening the task again."
        $.messageDocBlockInitial = "Another user is already working on this task. If you still would like to contribute to this task, please try opening the task again later.";
        $.labelHours = "hours";
        $.labelSeconds = "seconds";
        $.labelMinutes = "minutes";
        $.lastBlockDate = null;
        $.messageCommentsDeleted = "Info: Target text change detected. Comments have now been reset.";
        $.messageNoParaphrasingResults = "No results found!";
        $.messageLoadingParaphrasingResults = "Loading...";
        $.messageParaprasingServiceFailed = "Problem ocurred.";
        $.messageParaprasingServiceTimeOut = "Operation timed out.";
        $.messageInteractiveCheckNotAvailable = "The interactive check configuration is incorrect. Please contact your project administrator.";
        $.messageInteractiveCheckNoResults = "No issues were found.";
        $.dismissLabel = "Dismiss";

        //plug-in default settings.
        var settings = $.extend({
            'dialogHeight': 650,
            'dialogWidth': 800,
            'imagesPath': '../css/images',
            'cssPath': "..extras/accept-pre-edit-real-time/css",
            'templateDelimiterSelector': 'DIV',
            'presentationFormat': 'TEXT',
            'acceptServerPath': '',
            'acceptHubUrl': '[ACCEPT_API]/AcceptApi/signalr',
            'interactiveCheckConfigPath': '[ACCEPT_API]/AcceptApi/config/lang',
            'textIdContainer': '',
            'userIdSelector': '',
            'userIdContainer': '',
            'leftPaneWidth': '320px',
            'leftPaneHeight': 'auto',
            'leftPaneFontSize': '1em',
            'buttonsFontSize': '0.8em',
            'navigationButtonsFontSize': '0.6em',
            'textAreasWidth': '100%',
            'textAreasHeight': '100%',
            'bottomPaneFontSize': '1em',
            'customUniqueUserIdSelector': function () { return undefined; },
            'commentsCleanDisplayPeriod': 3000,
            'dialogPosition': ['top', 50],
            'displayExtend': true,
            'dialogExtendOptions':
            {
                "close": true,
                "maximize": true,
                "minimize": false,
                "events":
                {
                    "maximize": function () {
                        maximize();
                        setTimeout(function () { $('#postEditDialog_').scrollTop(0); }, 400);
                    },
                    "restore": function () {

                        restorePostEditContainerElementsSize(false);
                        setTimeout(function () { $('#postEditDialog_').scrollTop(0); }, 400);
                    }
                   , "beforeMaximize": function () {
                       beforeMaximize();
                   },
                    "beforeRestore": function () {
                    }
                }
            }
        }, options);

        //before maximization occurs it records the height/width values for some of the intervenients.
        function beforeMaximize() {
            var selectorWidthCalculation = "#editedContent_ , #divSourceTextContainer_ , #sourceTextArea_ , #commentsTextArea_ , #divComments, #targetTextArea__tbl, #divOptions";
            oldh = $('#postEditDialog_').height();
            oldw = $('#postEditDialog_').width();
            $('#postEditDialog_').data('isMaximized', { state: true });
            $(selectorWidthCalculation).each(function () {
                $(this).data('elementWidth', { elementWidthBeforeMaximize: $(this).css("width") });
                $(this).data('elementHeight', { elementHeightBeforeMaximize: $(this).css("height") });
            });
        }

        //maximizes the dialog window.
        function maximize() {
            newh = $('#postEditDialog_').height();
            neww = $('#postEditDialog_').width();
            var selectorWidthCalculation = "#editedContent_ , #divSourceTextContainer_";
            $(selectorWidthCalculation).each(function () {
                var childElmHeight = $(this).height();
                var childElmWidth = $(this).width();
                var percentHeight = parseFloat(((newh - oldh) / oldh));
                var percentWidth = parseFloat(((neww - oldw) / oldw));
                $(this).width(parseFloat((childElmWidth + (childElmWidth * percentWidth))).toString() + "px");
                $(this).height(parseFloat((childElmHeight + (childElmHeight * percentHeight))).toString() + "px");
            });
            selectorWidthCalculation = '#sourceTextArea_ , #commentsTextArea_ , #targetTextArea__tbl , #divComments';
            $(selectorWidthCalculation).each(function () {
                try {
                    var childElmHeight = $(this).height();
                    var percentHeight = parseFloat(((newh - oldh) / oldh));
                    $(this).width('100%');
                    $(this).height(parseFloat((childElmHeight + (childElmHeight * percentHeight))).toString() + "px");
                } catch (e) { }
            });
        }

        //after maximization occurs it records the height/width values for some of the intervenients.
        function restorePostEditContainerElementsSize(restoreDefaults) {
            try {
                if (restoreDefaults) {
                    try {
                        $("#editedContent_").css("height", settings.leftPaneHeight);
                        $("#editedContent_").css("width", settings.leftPaneWidth);

                        $("#divSourceTextContainer_").css("width", settings.textAreasWidth);
                        $("#sourceTextArea_").css("width", settings.textAreasWidth);
                        $("#sourceTextArea_").css("height", settings.textAreasHeight);

                        $("#commentsTextArea_").css("height", settings.textAreasHeight);
                        $("#commentsTextArea_").css("width", settings.textAreasWidth);

                        $("#divComments").css("width", settings.textAreasWidth);
                        $("#divOptions").css("width", settings.textAreasWidth);

                        if ($('#postEditDialog_').data('isMaximized') !== undefined && $('#postEditDialog_').data('isMaximized').state === true) {
                            $("#targetTextArea__tbl").width(parseFloat($("#targetTextArea__tbl").data('elementWidth').elementWidthBeforeMaximize).toString() + "px");
                            $("#targetTextArea__tbl").height(parseFloat($("#targetTextArea__tbl").data('elementHeight').elementHeightBeforeMaximize).toString() + "px");
                        }

                    } catch (e) { }

                }
                else {
                    if ($('#postEditDialog_').data('isMaximized') !== undefined && $('#postEditDialog_').data('isMaximized').state === true) {
                        var selectorWidthCalculation = "#editedContent_ , #divSourceTextContainer_ , #sourceTextArea_ , #commentsTextArea_ , #targetTextArea__tbl , #divComments, #divOptions";
                        $(selectorWidthCalculation).each(function () {
                            try {
                                $(this).css("width", $(this).data('elementWidth').elementWidthBeforeMaximize.toString());
                                $(this).css("height", $(this).data('elementHeight').elementHeightBeforeMaximize.toString());
                            } catch (e) { }
                        });
                    }
                }
            } catch (e) { }
            $('#postEditDialog_').data('isMaximized', { state: false });
        }

        //init UI text and labels.
        function setUILanguage(lang) {
            if (lang == 'fr') {
                $.labelEdit = "Editer";
                $.labelHelp = "Aide";
                $.labelPreEditTitle = "Vérifier l'orthographe, la grammaire et le style";
                $.labelClickOntextToEdit = "Cliquez sur le texte à éditer:";
                $.htmlDialogHelp = '<p>Cette fenêtre comporte deux volets: sur la gauche se trouve la traduction automatique ' +
                'd\'un texte, qui contient une ou plusieurs phrases. Chacune de ces phrases peut être améliorée grâce à vos modifications.</p>' +
                '<p>Sur la droite se trouve la zone "Phrase en cours à éditer" qui vous permet d\' éditer une phrase traduite de façon automatique, en suivant les consignes disponibles en cliquant sur le bouton "Consignes". ' +
                'Il y a deux boutons au-dessus de la zone d\'édition: un bouton "Annuler" et un bouton "Rétablir".</p>' +
                '<p> Ces boutons affectent la phrase en cours d\'édition. Pour chaque phrase, vous pouvez, si vous le souhaitez, ' +
                'laisser des commentaires dans la zone "Commentaires". Et ne vous inquiétez pas pour l\'enregistrement de vos changements ou commentaires, cela se fait automatiquement! ' +
                'Vous pouvez passer d\'une phrase à une autre de trois façons: soit en cliquant sur n\'importe quelle phrase sur la gauche de la fenêtre, soit en utilisant les boutons "Préc" ou "Suiv" ou les racourcis TAB ou MAJ.+ TAB  pour avancer phrase par phrase.</p>' +
                '<p>Si vous souhaitez faire une pause, cliquez sur "Enregistrer pour plus tard" afin de reprendre votre activité lorsque vous ré-ouvrerez la tâche. Une fois ' +
				'vos changements ou commentaires terminés, cliquez sur "Terminer la tâche". Si vous avez le moindre problème, contacter la personne en charge de ce projet.</p>';

                $.labelPrev = "Préc (Shift+Tab)";
                $.labelNext = "Suiv (Tab)";
                $.labelGuidelinesTitle = "Consignes";
                $.htmlBilingualGuidelines = '<h4>Consignes de post‐édition <span id="guideLinesTranslationType_" >bilingue</span>:</h4>' +
                '<p>Essayez d\'améliorer le texte cible en:</p>' +
                '<ul>' +
                '<li>Vérifiant que le sens de la phrase source est préservé</li>' +
                '<li>Vérifiant qu\'aucun élément d\'information n\'ait été ajouté ou supprimé par accident</li>' +
                '<li>Vous appuyant le plus possible sur la suggestion de traduction</li>' +
                '<li>Appliquant les règles d\'usage d\'orthographe et de grammaire</li>' +
                '<li>Gardant en tête le fait que les corrections de nature stylistique sont superflues</li>' +
               '<li>Gardant en tête le fait que les modifications de structure de phrases liées à la lisibilité du texte sont également superflues</li>' +
               '</ul>';
                $.htmlGuidelinesMonolingual = '<h4> Consignes de post‐édition <span id="guideLinesTranslationType_" >monolingue</span>:</h4>' +
                        '<p> Essayez d\'améliorer le texte cible en:</p>' +
                '<ul>' +
                '<li>Vérifiant que tout élément d\'information est correct</li>' +
                '<li>Vous appuyant le plus possible sur la suggestion de traduction</li>' +
                '<li>Appliquant les règles d\'usage d\'orthographe et de grammaire</li>' +
                '<li>Gardant en tête le fait que les corrections de nature stylistique sont superflues</li>' +
               '<li>Gardant en tête le fait que les modifications de structure de phrases liées à la lisibilité du texte sont également superflues</li>' +
               '</ul>';
                $.labelQuickQuestionTitle = "Question";
                $.labelConfirmationNeeded = "Confirmation requise";
                $.labelConfirmationText = "Cette action va mettre fin à votre édition, êtes-vous sûr?";
                $.labelQuickAnswerDone = "Terminer";
                $.labelConfirmationYes = "Oui";
                $.labelConfirmationNo = "Non";
                $.labelCurrentSentenceToEdit = "Phrase en cours à éditer:";
                $.labelTargetTextTitle = "Texte cible";
                $.labelSourceTextTitle = "Texte source";
                $.labelComments = "Commentaires?";
                $.labelCommentsTitle = "Commentaires";
                labelCloseDialog = 'Enregistrer pour plus tard';
                labelGuideLines = 'Consignes';
                labelUserAllSelected = 'Terminer la tâche';
                $.labelOriginalSentence = "Phrase source:";
                $.labelShowSource = "Afficher source";
                $.labelHideSource = "Cacher source";
                $.messageDocBlock = "Cela fait au moins @timespan@ que vous travaillez sur cette tâche, ce qui correspond au temps maximum imparti comme défini par l'administrateur de votre projet.  Félicitations! <br /><br /> Un autre utilisateur travaille maintenant sur cette tâche. Si vous souhaitez toutefois y contribuer de nouveau, veuillez attendre que cet utilisateur ait fini avant de rouvrir cette tâche."
                $.messageDocBlockInitial = "Un autre utilisateur est déjà en train de travailler sur cette tâche. Si vous souhaitez toutefois y contribuer, veuillez rouvrir cette tâche plus tard.";
                $.labelHours = "heures";
                $.labelMinutes = "minutes";
                $.labelSeconds = "secondes";
                $.messageCommentsDeleted = 'Info: Modification du texte cible détecté. Commentaires remis à zéro.';
                labelInteractiveCheck = 'Lancer la vérification interactive';
                labelTranslationOptions = 'Utiliser les options de traductions';
                labelParaphrasingService = 'Utiliser le service de paraphrases';
                $.messageNoParaphrasingResults = "Aucun résultat!";
                $.messageLoadingParaphrasingResults = "Chargement...";
                $.messageParaprasingServiceFailed = "Un problème est survenu.";
                $.messageInteractiveCheckNotAvailable = "La configuration de vérification interactive est erronée. Veuillez contacter votre administrateur de projet.";
                $.messageInteractiveCheckNoResults = "Pas de problème détecté.";
                //adjust the line-height for the switch button.
                $("#switcherButton_").css("line-height", "3");
                //$("#switchParaphrasingButton_").css("font-size", "0.6em");
                $.dismissLabel = "Rejeter";

            } else
                if (lang == 'de') {
                    $.labelEdit = "Bearbeiten";
                    $.labelHelp = "Hilfe";
                    $.labelPreEditTitle = "Rechtschreibung, Grammatik und Stil prüfen";
                    $.labelClickOntextToEdit = "Klicken Sie auf den Text um diesen zu bearbeiten:";
                    $.htmlDialogHelp = '<p>Dieses Fenster besteht aus zwei Teilen: Auf der linken Seite finden Sie den maschinell übersetzten Text, der mehrere Sätze beinhaltet. '
					+ 'Jeder dieser Sätze kann durch eine Bearbeitung von Ihnen verbessert werden.</p><p>Das Textfeld “aktueller Satz zum Bearbeiten” auf der rechten Seite ermöglicht es Ihnen einen maschinell übersetzten Satz zu bearbeiten, '
					+ 'indem Sie den Richtlinien folgen, die Sie über die “Richtlinien”-Schaltfläche erreichen können. Über dem Bearbeitungsfenster gibt es zwei Schaltflächen: eine „Rückgängig“-Schaltfläche und eine „Wiederholen“-Schaltfläche.'
					+ '</p> <p>Diese Schaltflächen werden den Satz beeinflussen, der aktuell bearbeitet wird. Sie können für jeden Satz Kommentare in dem “Kommentare”-Eingabefeld hinzufügen – ob Sie diese Funktion verwenden '
					+ 'möchten, ist Ihnen völlig freigestellt.  Sie müssen sich nicht darum kümmern die Änderungen oder Ihre Kommentare zu speichern - das geschieht automatisch! Sie können auf zwei verschiedene '
					+ 'Arten zwischen den Sätzen navigieren: Sie können auf drei verschiedene Arten zwischen den Sätzen navigieren: Sie können entweder auf einen Satz auf der linken Seite klicken, die “Zurück” und “Weiter” Schaltflächen verwenden, '
					+ 'oder die „Umschalttaste + Tabulatortaste“ Kombination und die „Tabulatortaste“ verwenden, um sich um jeweils einen Satz zu bewegen.</p><p>Falls Sie eine Pause machen möchten, klicken Sie auf “für später speichern”, sodas Sie die '
					+ 'Aktivität wieder aufnehmen können, sobald Sie die Aufgabe das nächste Mal öffnen. Wenn Sie keine Bearbeitungen mehr vornehmen und keine Kommentare mehr schreiben wollen, klicken Sie auf “Aufgabe fertigstellen”. Sollte ein Problem auftreten, '
					+ 'kontaktieren Sie bitte ihren Projekt-Administrator. </p>';
                    $.labelPrev = "Zurück (Shift + Tab)";
                    $.labelNext = "Weiter (Tab)";
                    $.labelGuidelinesTitle = "Tipps";
                    labelGuideLines = 'Tipps';
                    $.htmlBilingualGuidelines = '<h4>Richtlinien zur<span id="guideLinesTranslationType_" >zweisprachig</span> Bearbeitung:</h4>' +
                    '<p> - Achten Sie darauf, dass die Übersetzung semantisch korrekt ist.</p>' +
                    '<p> - Stellen Sie sicher das keine Informationen versehentlich hinzugefügt oder gel öscht wurden.</p>' +
                    '<p> - Falls W örter, Satzteile oder Zeichensetzung in dem Text völlig akzeptal sind, versuchen Sie diese unbearbeitet zu verwenden, anstatt sie mit etwas Neuem und Anderen zu ersetzen.</p>';
                    $.labelQuickQuestionTitle = "Kurze Frage";
                    $.labelConfirmationNeeded = "Bestätigung erforderlich";
                    $.labelConfirmationText = "Sind Sie sicher, dass Sie die Bearbeitung beenden möchten?";
                    $.labelQuickAnswerDone = "Fertig";
                    $.labelConfirmationYes = "Ja";
                    $.labelConfirmationNo = "Nein";
                    $.labelCurrentSentenceToEdit = "Aktueller Satz zum Bearbeiten:";
                    $.labelTargetTextTitle = "Zieltext";
                    $.labelSourceTextTitle = "Ausgangstext";
                    $.labelComments = "Kommentare ?";
                    $.labelCommentsTitle = "Kommentare";
                    $.htmlGuidelinesMonolingual = '<h4>Tipps zum <span id="guideLinesTranslationType_" ></span>Nachbearbeiten:</h4>' +
                                                      '<p> - Bearbeiten Sie den Text nach Ihrer Interpretation so, dass er flüssiger und klarer wird.</p>' +
                                                      '<p> - Versuchen Sie z.B. die Wortfolge und Rechtschreibung zu korrigieren, wenn durch diese der Text schwer oder nicht zu verstehen ist.</p>' +
                                                      '<p> - Verwenden Sie Wörter, Satzteile oder Zeichensetzung unbearbeitet, falls diese akzeptabel sind.</p>' +
                    '<p> - Wenn Sie mit Referenz zum Originaltext arbeiten, achten Sie darauf, dass keine Informationen hinzugefügt oder gelöscht wurden.</p>';
                    labelCloseDialog = 'für später speichern';
                    labelUserAllSelected = 'Aufgabe fertigstellen';
                    $.labelOriginalSentence = "Ausgangssatz:";
                    $.labelShowSource = "Original einblenden";
                    $.labelHideSource = "Original ausblenden";
                    $.messageDocBlock = "Sie haben insgesamt mindestens @timespan@ an dieser Aufgabe gearbeitet. Dies wurde vom Administrator des Projekts als maximale Zeit, für die ein Benutzer eine Aufgabe sperren kann, festgelegt. Gut gemacht. <br/><br/> Diese Aufgabe wird momentan von einem anderen Benutzer bearbeitet. Wenn Sie zu mehr zu dieser Aufgabe beitragen möchten, warten Sie bitte bis dieser Benutzer fertig ist, bevor sie die Aufgabe erneut öffnen."
                    $.messageDocBlockInitial = "Ein anderer Benutzer arbeitet bereits an dieser Aufgabe. Falls Sie weiterhin etwas zu dieser beitragen möchten, versuchen Sie es später erneut die Aufgabe zu öffnen.";
                    $.labelHours = "stunden";
                    $.labelMinutes = "protokoll";
                    $.labelSeconds = "sekunden";
                    $.messageCommentsDeleted = "Info: Zieltextänderung erkannt. Kommentare wurden zurückgesetzt.";
                    labelInteractiveCheck = 'Interaktiven Check ausführen';
                    labelTranslationOptions = ' Übersetzungsoptionen aktivieren';
                    labelParaphrasingService = 'Paraphrasierung aktivieren';
                    $.messageNoParaphrasingResults = "Keine Ergbenisse gefunden!";
                    $.messageLoadingParaphrasingResults = "Ergebnisse werden geladen...";
                    $.messageParaprasingServiceFailed = "Problem ist aufgetreten.";
                    $.messageInteractiveCheckNotAvailable = "Die Konfigurierung für den interaktiven Check ist unzulässig. Bitte kontaktieren Sie Ihren Projektadministrator.";
                    $.messageInteractiveCheckNoResults = "Es wurden keine Probleme gefunden.";
                    //$("#switchParaphrasingButton_").css("font-size", "0.6em");
                    $.dismissLabel = "ablehnen";
                }
                else {
                    //adjust the line-height for the switch button.
                    $("#switcherButton_").css("line-height", "3")
                }
            //main dialog title.
            $("#ui-dialog-title-postEditDialog_").attr("title", $.labelEdit.toString());
            $("#ui-dialog-title-postEditDialog_").text($.labelEdit.toString());
            //help title.
            $("#imgPostAcceptInfo_ ").attr("alt", $.labelHelp.toString());
            $("#helpPostDialog_").attr("title", $.labelHelp.toString());
            //pre-edit title.
            $("#tdTarget_").attr("title", $.labelPreEditTitle.toString());         
            //click on text to edit.
            $("#labelClickOnTextToEdit_").text($.labelClickOntextToEdit.toString());
            //help dialog.
            $("#helpPostDialog_").html($.htmlDialogHelp.toString());
            //next and prev links.
            $("#postEditLinkPrev_").text($.labelPrev.toString());
            $("#postEditLinkNext_").text($.labelNext.toString());
            //guidelines title.
            $("#guideLinesDialog_").attr("title", $.labelGuidelinesTitle.toString());           
            //guidelines dialog body.
            if ($.configurationId == "2")
                $("#guideLinesDialog_").html($.htmlGuidelinesMonolingual.toString());
            else
                if ($.configurationId == "1")
                    $("#guideLinesDialog_").html($.htmlBilingualGuidelines.toString());
            //question dialog title.
            $("#completeQuestionDialog_").attr("title", $.labelQuickQuestionTitle.toString());
            //complete dialog title.
            $("#closeDialog_").attr("title", $.labelConfirmationNeeded.toString());
            //complete dialog body.
            $("#closeDialog_").text($.labelConfirmationText.toString());
            //quick question dialog - button done.
            $("#btn-done_").val($.labelQuickAnswerDone.toString());
            //complete dialog - button yes.
            $("#btn-yes_").val($.labelConfirmationYes.toString());
            //complete dialog - button no.
            $("#btn-no_").val($.labelConfirmationNo.toString());
            //current sentence to edit.
            $("#currentSentenceToEditLabel_").text($.labelCurrentSentenceToEdit.toString());
            //target text-area title.
            $("#targetTextArea_").attr("title", $.labelTargetTextTitle.toString());
            //source text-area title.
            $("#sourceTextArea_").attr("title", $.labelSourceTextTitle.toString());
            //label comments
            $("#labelComments_").text($.labelComments.toString());
            //comments title
            $("#commentsTextArea_").attr("title", $.labelCommentsTitle.toString());
            //main dialog - save for later button.
            $("#btn-cancel-post-accept .ui-button-text").text(labelCloseDialog.toString());
            //main dialog - complete task button.
            $("#btn-completeTask-accept .ui-button-text").text(labelUserAllSelected.toString());
            //main dialog - guidelines button.
            $("#btn-guidelines-accept .ui-button-text").text(labelGuideLines.toString());
            //source text-area text.
            $("#labelOriginalSentence_").text($.labelOriginalSentence.toString());
        }

        //init plug-in.
        function initAcceptPostEdit() {

            //inject html on the page.
            injectHTML();
            //for each element targeted by the plug-in configuration.
            $(thisObject).each(function () {

                //on the click even the dialog box will be dislayed loading the content for edition.  
                $(this).bind('click', function () {
                    //think phase initial timestamp is triggered.
                    $.globalThinkPhaseInitTime = new Date();
                    //the text id attribute hidden in the element will be used to identify the content being edited.
                    $.textId = $(this).attr(settings.textIdContainer);

                    //get user details.                  
                    if (settings.customUniqueUserIdSelector() === undefined)
                        $.currentUserId = $(this).find(settings.userIdSelector).attr(settings.userIdContainer);
                    else
                        $.currentUserId = settings.customUniqueUserIdSelector();

                    if ($.currentUserId !== null && $.textId !== null && $.currentUserId.length > 0 && $.textId.length > 0) {
                        if ($("#postEditDialog_").hasClass("ui-dialog-content")) {
                            cleanPluginData();
                            $(".targetOptionContextWrapper").remove();

                            //avoid remainings from an already opened dialog.
                            saveBeforeExit();;
                            $('#postEditDialog_').removeAttr("style");
                            $('#postEditDialog_').removeAttr("class");
                            $("#postEditDialog_").css("display", "none");
                            $('#postEditDialog_').parent().find('div[class^="ui"]').remove();
                            $('#postEditDialog_').unwrap();
                        }

                        $.userBrowser = $.browser;
                        generateDialogWindow();
                        $("#btn-completeTask-accept").css("display", "none");
                        $("#btn-guidelines-accept").css("display", "none");
                        $("#btn-cancel-post-accept").css("display", "none");
                        setTimeout(function () {
                            getContent();
                        }, 200);

                    }
                    else {
                        //norton forum specific integration.
                        if ($.currentUserId === null || $.currentUserId.length === 0)
                            alert("If you think this translation needs a bit of TLC, why don’t you log in and improve it by clicking the text?");
                    }

                    setTimeout(function () {

                        $("#postEditLinkPrev_").button();
                        $("#postEditLinkNext_").button();
                        //var attr = $("#postEditLinkPrev_").attr('aria-disabled');
                        // for some browsers, attr is undefined; for others,
                        // attr is false.  checking for both.
                        if (/*typeof attr === typeof undefined && attr === false*/$("#postEditLinkPrev_").attr('aria-disabled') > 0) {

                            var checkjQueryUiButton = setInterval(function () {
                                $("#postEditLinkPrev_").button();
                                $("#postEditLinkNext_").button();
                                //attr = $("#postEditLinkPrev_").attr('aria-disabled');
                                if (/*typeof attr !== typeof undefined && attr !== false*/$("#postEditLinkPrev_").attr('aria-disabled') > 0) {
                                    clearInterval(checkjQueryUiButton);
                                }
                            }, 200);

                        }
                    }, 1000);

                });
            });

            //bind hot keys.
            bindDocumentHotkeys();
        }

        //binds change event to the preset comments options within the preset comments ddl.
        function injectSelectorEventListener() {
            //remove all events that might be already added.
            $('#notesSelector_').unbind();
            $("#notesSelector_").change(function () {
                var str = "";
                var value = "";
                $("#notesSelector_ option:selected").each(function () {
                    str += $(this).text();
                    value += $(this).val();
                });
                //the pool index starts from zero and the global position start from one.
                var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);
                var currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases.length - 1);
                //ddl options persisting logic.
                var currentAnnotatesFromUserIndex = -1;
                if ($.editOptions[0] != null && value != $.editOptions[0]) {
                    if (!isNewPhaseCreatedForThisRevision) {
                        //ddl options persisting logic.     
                        currentAnnotatesFromUserIndex = $.checkNoteCriteria(translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].phaseNotes, "target", "user");
                        if (currentAnnotatesFromUserIndex < 0)
                            translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].phaseNotes.push(new Note("target", 'user', str));
                        else
                            translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].phaseNotes[currentAnnotatesFromUserIndex].value = str;
                    }
                    else {
                        //updating the current phase index for non thinking phases.
                        currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
                        //ddl options persisting logic.      
                        currentAnnotatesFromUserIndex = $.checkNoteCriteria(translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].phaseNotes, "target", "user");
                        if (currentAnnotatesFromUserIndex < 0)
                            translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].phaseNotes.push(new Note("target", 'user', str));
                        else
                            translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].phaseNotes[currentAnnotatesFromUserIndex].value = str;
                    }
                    translationUnitsPool[currentTranslationUnitArrayIndex].lastOption = str;
                }
                else {
                    if (!isNewPhaseCreatedForThisRevision) {
                        currentAnnotatesFromUserIndex = $.checkNoteCriteria(translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].phaseNotes, "target", "user");
                        if (currentAnnotatesFromUserIndex > 0)
                            translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].phaseNotes.splice(currentAnnotatesFromUserIndex, 1);
                    } else {
                        //updating the current phase index for non thinking phases.
                        currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
                        currentAnnotatesFromUserIndex = $.checkNoteCriteria(translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].phaseNotes, "target", "user");
                        if (currentAnnotatesFromUserIndex > 0)
                            translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].phaseNotes.splice(currentAnnotatesFromUserIndex, 1);
                    }

                    translationUnitsPool[currentTranslationUnitArrayIndex].lastOption = "";
                }
            }).change();
        }

        //creates main jquery dialog.
        function generateDialogWindow() {                              
            $('#postEditDialog_').dialog({
                width: settings.dialogWidth, height: settings.dialogHeight, resizable: true, position: settings.dialogPosition || 'center',
                open: function (event, ui) {
                    $('div[aria-labelledby=ui-dialog-title-' + "postEditDialog_" + ']').find('.ui-dialog-buttonpane').append('<img id="imgPostAcceptInfo_" width="30px" height="30px" style="float:left;cursor:pointer;margin:4px;margin-top:10px;" src="' + settings.imagesPath + '/info_accept.png" alt="' + $.labelHelp.toString() + '" />');
                    $('div[aria-labelledby=ui-dialog-title-' + "postEditDialog_" + ']').find('.ui-dialog-buttonpane').css("font-size", settings.bottomPaneFontSize);
                    $('div[aria-labelledby=ui-dialog-title-' + "postEditDialog_" + ']').find('.ui-dialog-buttonpane .ui-dialog-buttonset').append('<img id="imgInteractiveCheckLoading_" alt="" src="' + settings.imagesPath + '/ajax-loader-interactive-check.gif" style="vertical-align: middle;margin: .5em .4em .5em 0;display:none;" /><div class="slider-frame-paraprasing" style="float: right;margin: .5em .4em .5em 25px;display:none;"><span style="font-size:' + settings.buttonsFontSize + ';" class="slider-button-paraprasing" id="switchParaphrasingButton_"></span></div>');
                    setTimeout(function () { $('#postEditDialog_').scrollTop(0); }, 1000);
                },
                resizeStart: function (event, ui) {
                    startW = $(this).dialog("option", "width");
                    startH = $(this).dialog("option", "height");
                },
                resizeStop: function (event, ui) {
                    endW = $(this).dialog("option", "width");
                    endH = $(this).dialog("option", "height");
                },
                beforeClose: function (event, ui) {
                    if ($('#postEditDialog_').data('isMaximized') !== undefined && $('#postEditDialog_').data('isMaximized').state === true)
                        $('#postEditDialog_').dialogExtend("restore");
                },
                close: function (event, ui) {
                    saveBeforeExit();
                    cleanPluginData();
                    //avoid remainings from an already opened dialog.
                    $('#postEditDialog_').removeAttr("style");
                    $('#postEditDialog_').removeAttr("class");
                    $("#postEditDialog_").css("display", "none");
                    $('#postEditDialog_').parent().find('div[class^="ui"]').remove();
                    $('#postEditDialog_').unwrap();
                },
                drag: function (event, ui) { clearContextMenus(); },
                create: function (event, ui) {
                    $("#postEditDialog_").append('<div class="dialog-footer-bar" style="display:none;" id="footerDialog"></div>');
                },
                buttons: [
                 {
                     id: "btn-completeTask-accept",
                     text: labelUserAllSelected,
                     click: function () {
                         saveBeforeExit();
                         createCloseDialog();
                     }
                 },
                {
                    id: "btn-guidelines-accept",
                    text: labelGuideLines,
                    click: function () {
                        createGuideLinesDialog();
                    }

                },
                {
                    id: "btn-cancel-post-accept",
                    text: labelCloseDialog,
                    click: function () {
                        $(this).dialog("close");
                    }
                }
                ]
            }).dialogExtend(settings.displayExtend ? settings.dialogExtendOptions : {});

            $("#imgPostAcceptInfo_").click(function () {
                $("#helpPostDialog_").dialog("close");
                $("#helpPostDialog_").dialog("destroy");
                $("#helpPostDialog_").dialog({
                    resizable: true,
                    width: 500,
                    height: 'auto',
                    modal: false,
                    buttons: {
                        "Ok": function () {
                            $("#helpPostDialog_").dialog("close");
                            $("#helpPostDialog_").dialog("destroy");
                        }
                    }
                });

            });
        }


        //persist drop down list.
        $.changeOptionsSelector = function (revisionValue) {
            $("#notesSelector_ option").each(function (index, value) {
                if (revisionValue == $(this).val())
                    $('#notesSelector_>option:nth-child(' + (index + 1).toString() + ')').attr('selected', true);
            });
        }

        //ddl options persisting logic.
        $.checkNoteCriteria = function (notes, annotatesCriteria, fromCriteria) { for (var i = 0; i < notes.length; i++) if (notes[i].annotates === annotatesCriteria && notes[i].from === fromCriteria) return i; return -1; }

        //creates left pane pagination(hot keys are binded separetadle).
        function createPagination(contentElementId) {
            //how much segments within the placeholder.
            var show_per_page = 1;
            //getting the amount of desired elements inside main content div.
            var number_of_items = $('#' + contentElementId).find("div").size();
            //calculate the number of segments we are going to have.
            var number_of_pages = Math.ceil(number_of_items / show_per_page);
            //set the value of our hidden input fields.
            $('#current_page').val(0);
            $('#show_per_page').val(show_per_page);
            //what are we going to have in the navigation?
            //- link to previous page.
            //- links to specific pages.
            //- link to next page.          
            var navigation_html = '<a id="postEditLinkPrev_" style="font-size:' + settings.navigationButtonsFontSize + '" class="previous_link" href="javascript:$.previous(\'' + contentElementId + '\');">' + $.labelPrev.toString() + '</a>';
            var current_link = 0;
            while (number_of_pages > current_link) {
                navigation_html += '<a style="display:none" class="page_link" href="javascript:goToPage(' + current_link + ', ' + '\'' + contentElementId + '\'' + ')" longdesc="' + current_link + '">' + (current_link + 1) + '</a>';
                current_link++;
            }
            navigation_html += '<a id="postEditLinkNext_" style="font-size:' + settings.navigationButtonsFontSize + '" class="next_link" href="javascript:$.next(\'' + contentElementId + '\');">' + $.labelNext.toString() + '</a>';
            //fill page navigation placeholder.
            $('#page_navigation').html(navigation_html);
            //add active_page class to the first page link.
            $('#page_navigation .page_link:first').addClass('active_page');
            //remove highlight from all elements on the left pane.     
            $('#' + contentElementId).find("div").removeClass('postedit-highlight');
            //and show the first n (show_per_page) elements.         
            $('#' + contentElementId).find("div").slice(0, show_per_page).addClass('postedit-highlight');
            //selects the first element.
            goToPage(0, 'editedContent_');
        }

        //loads remote content for edition.
        function getContent() {
            if ($.userBrowser.msie) {
                call = settings.acceptServerPath + "/PostEdit/Document";
                var xdr = new XDomainRequest();
                xdr.open("POST", call);
                xdr.onload = function () {
                    parseContent(xdr.responseText);
                };
                xdr.onerror = function () { };
                xdr.onprogress = function () { };
                xdr.ontimeout = function () { };
                xdr.onopen = function () { };
                xdr.timeout = 5000;
                xdr.send(JSON.stringify({ "textId": "" + $.textId + "", "userId": "" + $.currentUserId + "" }));
            }
            else {
                $.ajax({
                    url: settings.acceptServerPath + "/PostEdit/Document",
                    dataType: 'json',
                    contentType: "application/json",
                    type: "POST",
                    async: true,
                    cache: false,
                    data: '{"textId":"' + $.textId + '","userId":"' + $.currentUserId + '"}',
                    success: function (data) {

                        if (data.Exception == $.blockedDocumentMessage) {
                            displayBlockedRevisionMessage($.messageDocBlockInitial);
                        } else
                            parseContent(data);
                    },
                    complete: function (data) { },
                    error: function (error) { }
                });
            }
        }

        //edition task has been completed.
        $.completeDocument = function (questionReply) {
            if ($.userBrowser.msie) {
                var call = settings.acceptServerPath + "/PostEdit/CompleteDocumentJsonP?textId=" + $.textId + "&userId=" + $.currentUserId + "&questionId=" + $.questionId + "&finalReply=" + encodeURIComponent(questionReply) + "&callback=?";
                $.ajax({
                    type: 'GET',
                    url: call,
                    dataType: 'json',
                    success: function (data) { },
                    complete: function () { $("#postEditDialog_").dialog("close"); location.reload(true); },
                    error: function (data) { },
                    data: {},
                    cache: false,
                    async: false
                });
            }
            else {
                $.ajax({
                    url: settings.acceptServerPath + "/PostEdit/CompleteDocument",
                    dataType: 'json',
                    contentType: "application/json",
                    type: "POST",
                    async: true,
                    cache: false,
                    data: '{"textId":"' + $.textId + '","userId":"' + $.currentUserId + '", "questionId":"' + $.questionId + '","finalReply":"' + questionReply + '"}',
                    success: function (data) { },
                    complete: function (data) { $("#postEditDialog_").dialog("close"); location.reload(true); },
                    error: function (error) { }
                });
            }
        }

        //submits a revision phase.
        $.submitRevision = function (jsonData) {
            if ($.userBrowser.msie) {
                var jsonObj = JSON.parse(jsonData);
                call = settings.acceptServerPath + "/PostEdit/TranslationRevisionPhaseIe";
                var xdr = new XDomainRequest();
                xdr.open("POST", call);
                xdr.onload = function () {
                    var jsonObj = JSON.parse(xdr.responseText);
                    if (jsonObj.Exception == $.blockedDocumentMessage) {
                        displayBlockedRevisionMessage($.messageDocBlock.replace("@timespan@", formatThresholdPeriod($.projectMaxThreshold)));
                    }
                };
                xdr.onerror = function () { };
                xdr.onprogress = function () { };
                xdr.ontimeout = function () { };
                xdr.onopen = function () { };
                xdr.timeout = 5000;
                xdr.send(JSON.stringify({ "jsonRawString": "" + encodeURIComponent(jsonData) + "" }));
            }
            else {
                $.ajax({
                    url: settings.acceptServerPath + "/PostEdit/TranslationRevisionPhase",
                    dataType: 'json',
                    contentType: "application/json",
                    type: "POST",
                    async: true,
                    cache: false,
                    data: jsonData,
                    success: function (data) {
                        if (data.Exception == $.blockedDocumentMessage) {
                            displayBlockedRevisionMessage($.messageDocBlock.replace("@timespan@", formatThresholdPeriod($.projectMaxThreshold)));
                        }
                    },
                    complete: function (data) { },
                    error: function (error) { }
                });
            }
        }

        //when content foe edition is returned this method prepares/inits all client side data.
        function parseContent(data) {
            globalCurrentTranslationUnitIndex = 1;
            globalPreviousTranslationUnitIndex = 1;
            isNewPhaseCreatedForThisRevision = false;
            translationUnitsPool = [];
            $.configurationId = "1";
            $.processName = "bilingual";
            $.questionId = "";
            $.question = "";
            $.targetLanguage = "";
            $.editOptions = [];
            $.displayTranslationOptions = true;
            startPePhase = null;
            $.isSingleRevision = false;
            $.projectMaxThreshold = "";

            //paraphrasing reset.
            paraphrasingLanguage = "en";
            maxResults = 5;
            paraSystemId = "";
            isParaphrasingEnabled = false;

            //interactive check reset.
            isInteractiveCheckEnabled = false;
            interactiveCheckRuleSet = "";
            interactiveCheckLanguage = "en";

            if (data != null) {
                var mainContentObj = null;
                if ($.browser.msie) {
                    mainContentObj = JSON.parse(data);
                    contentObj = mainContentObj.ResponseObject;
                    if (mainContentObj.Exception == $.blockedDocumentMessage) {
                        displayBlockedRevisionMessage($.messageDocBlockInitial);
                        return;
                    }
                }
                else {
                    mainContentObj = data;
                    contentObj = data.ResponseObject;
                }
                //single revision.
                $.isSingleRevision = contentObj.isSingleRevisionProject;
                $.projectMaxThreshold = contentObj.maxThreshold;
                if ($.isSingleRevision) {
                    try {
                        var date = new Date(Date.parse(contentObj.lastBlockDate));
                        $.lastBlockDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
                    } catch (e) { }
                }
                
                //project configuration check.
                if (contentObj.configurationId != null && contentObj.configurationId != "") {
                    $.configurationId = contentObj.configurationId;
                    if ($.configurationId == "2")
                        $.processName = "monolingual";
                    $.customInterface = contentObj.customInterface;
                }

                $("#guideLinesTranslationType_").text($.processName);
                if (contentObj.questionIdentifier != null && contentObj.questionIdentifier != "" && contentObj.projectQuestion != null && contentObj.projectQuestion != "") {
                    $.questionId = contentObj.questionIdentifier;
                    $.question = contentObj.projectQuestion;
                }

                if (contentObj.editOptions != null && contentObj.editOptions.length > 0) {
                    for (var i = 0; i < contentObj.editOptions.length; i++)
                        $.editOptions.push(contentObj.editOptions[i]);
                }
                
                //set target language.
                if (contentObj.targetLanguage.length > 0) {
                    if (contentObj.targetLanguage.indexOf("fr") == 0) {
                        $.targetLanguage = "fr"; settings.preEditLanguageUI = "fr"; setUILanguage("fr"); paraphrasingLanguage = "fr"; interactiveCheckLanguage = "fr";
                    }
                    else
                        if (contentObj.targetLanguage.indexOf("de") == 0) {
                            $.targetLanguage = "de"; settings.preEditLanguageUI = "de"; setUILanguage("de"); interactiveCheckLanguage = "de";
                        }
                        else
                            if (contentObj.targetLanguage.indexOf("en") == 0)
                                $.targetLanguage = "en"; setUILanguage("en");

                }

                if (contentObj.displayTranslationOptions == 2)
                    $.displayTranslationOptions = false;

                switch (mainContentObj.ResponseStatus) {
                    case "OK":
                        {
                            if (contentObj.tgt_templates.length == 0) {
                                for (var i = 0; i < contentObj.tgt_sentences.length; i++) {
                                    $('#divMain_').append('<div style="display:inline;">' + contentObj.tgt_sentences[i].text + '</div>&nbsp;');
                                    var currentSegmentIndex = (i + 1);
                                    var newTranslationUnit = new TranslationUnit(currentSegmentIndex, "needs-review-translation", buildPhaseNameString(currentSegmentIndex, 1), "", contentObj.tgt_sentences[i].text, contentObj.tgt_sentences[i].lastComment, contentObj.tgt_sentences[i].lastOption);
                                    translationUnitsPool.push(newTranslationUnit);
                                }
                            } else {

                                for (var i = 0; i < contentObj.tgt_sentences.length; i++) {
                                    $('#divMain_').append(contentObj.tgt_templates[i].markup.replace("@TARGET@", contentObj.tgt_sentences[i].text));
                                    var currentSegmentIndex = (i + 1);
                                    var newTranslationUnit = new TranslationUnit(currentSegmentIndex, "needs-review-translation", buildPhaseNameString(currentSegmentIndex, 1), "", contentObj.tgt_sentences[i].text, contentObj.tgt_sentences[i].lastComment, contentObj.tgt_sentences[i].lastOption);
                                    translationUnitsPool.push(newTranslationUnit);
                                }

                            }
                            for (var i = 0; i < contentObj.src_sentences.length; i++) {
                                $('#divSourceMain_').append('<p id="sourcePar_' + (i + 1).toString() + '">' + contentObj.src_sentences[i].text + '</p>');
                                translationUnitsPool[i].source = contentObj.src_sentences[i].text;
                            }
                        } break;
                }

                //changes for the templates
                var countParagraphs = 0;
            
                $('#divMain_').find(settings.templateDelimiterSelector).each(function () {//$('#divMain_').find('P').each(function () {
                    ++countParagraphs;
                    $(this).attr("id", "spanParagraph_" + countParagraphs.toString());
                    $(this).attr("data-accept-not-display", "1");
                });


                $('#editedContent_').html($('#divMain_').html());
                //changes for the templates.
                $('#editedContent_').find(settings.templateDelimiterSelector).each(function () { //$('#editedContent_ DIV').each(function () {
                    $(this).click(function () {
                        //get current page.
                        var spanIdSplitted = $(this).attr('id').split('_');
                        //update page navigation.                                                         
                        goToPage((parseInt(spanIdSplitted[1]) - 1), 'editedContent_');
                    });

                    $(this).mouseover(function () {
                        if (!$(this).hasClass('postedit-highlight')) {
                            $(this).removeClass().addClass("highlightless");
                        }
                    });

                    $(this).mouseout(function () {                       
                        $(this).removeClass('highlightless');
                    });
                });
                createPagination('editedContent_');
               
                //mark auto-save check by default.
                $('#autoSaveCheckBox_').attr('checked', true);
                //load text editor.
                loadTextEditor($.targetLanguage);
                initMiscellaneousUiComponents();
                injectSelectorEventListener();
                if (translationUnitsPool[0].lastOption.length == 0)
                    $('#notesSelector_>option:nth-child(1)').attr('selected', true);
                else
                    $.changeOptionsSelector(translationUnitsPool[0].lastOption);

                $.globalStartTime = new Date();

                if ($('#targetTextArea__toolbar1').find('tr:last').length) {
                    $('#targetTextArea__toolbar1').find('tr:last').append('<td><select id="ddlRevisionHistory_" style="border-style: solid;border-width: 1px;display:none;" class="revision-history"></select></td>');
                    $.updateRevisionHistory(0);
                    $('#ddlRevisionHistory_').change(function (index, value) { alert(index); alert(value); });
                }
                else
                    var checkExistTinyMCEBottomToolbar = setInterval(function () {
                        if ($('#targetTextArea__toolbar1').find('tr:last').length) {
                            $('#targetTextArea__toolbar1').find('tr:last').append('<td><select id="ddlRevisionHistory_" style="border-style: solid;border-width: 1px;display:none;" class="revision-history"></select></td>');
                            $.updateRevisionHistory(0);
                            $('#ddlRevisionHistory_').change(function () {

                                if (this.value.length > 0)
                                    $('#targetTextArea_').val(decodeURIComponent(this.value).replace("<", "&lt;").replace(">", "&gt;"));

                            });
                            clearInterval(checkExistTinyMCEBottomToolbar);
                        }
                    }, 100);

                //hide loading .gif file.
                $("#divLoadingContainer").css("display", "none");
                $("#divDocumentBlockedContainer").css("display", "none");

                if (!$.isSingleRevision)
                    $("#btn-completeTask-accept").css("display", "inline");
                $("#spnMaxEditionThreshold_").text($.projectMaxThreshold);
                $("#btn-guidelines-accept").css("display", "inline");
                $("#btn-cancel-post-accept").css("display", "inline");
                $("#divMainContainer").css("display", "block");
            }

            //init paraphrasing.           
            if (!$.displayTranslationOptions && contentObj.paraphrasingService) {
                isParaphrasingEnabled = true;
                paraSystemId = contentObj.paraphrasingServiceMeta;
                initPostEditParaphrasing(contentObj.paraphrasingServiceMeta);
            }

            //isInteractiveCheckEnabled.
            if (contentObj.interactiveCheck == 1) {
                $('div[aria-labelledby=ui-dialog-title-' + "postEditDialog_" + ']').find(".slider-frame-paraprasing").css("display", "inline");
                interactiveCheckRuleSet = contentObj.interactiveCheckMeta;
                isInteractiveCheckEnabled = true;
                initInteractiveCheck();
            }
        }

        //formats the time period string thats is displayed when threshold is reached out(in the case of multiple users edition type scenario).
        function formatThresholdPeriod(thresholdPeriod) {
            try {
                return (thresholdPeriod.split(":")[0] != "00" ? thresholdPeriod.split(":")[0] + " " + $.labelHours : "") +
                (thresholdPeriod.split(":")[1] != "00" ? thresholdPeriod.split(":")[1] + " " + $.labelMinutes : "") +
                (thresholdPeriod.split(":")[2] != "00" ? thresholdPeriod.split(":")[0] || thresholdPeriod.split(":")[1] != "00" ? " and " + thresholdPeriod.split(":")[2] + " " + $.labelSeconds : thresholdPeriod.split(":")[2] + " " + $.labelSeconds : thresholdPeriod.split(":")[1] != "00" ? "" : "")

            } catch (e) { return thresholdPeriod + " "; }
        }

        //displays message informing users that the per project allowed edition period is over(in the case of multiple users edition type scenario).
        function displayBlockedRevisionMessage(message) {
            $("#spnBlockedMessage_").html(message);
            $("#btn-guidelines-accept").css("display", "none");
            $("#btn-cancel-post-accept").css("display", "none");
            $("#divMainContainer").css("display", "none");
            $("#divLoadingContainer").css("display", "none");
            $("#divDocumentBlockedContainer").css("display", "block");
        }

        //not used...
        $.updateRevisionHistory = function (index) {
            if (contentObj.targetRevisions != null && contentObj.targetRevisions.length > 0) {
                $('#targetTextArea__toolbar1').find('#ddlRevisionHistory_').empty();
                $('#targetTextArea__toolbar1').find('#ddlRevisionHistory_').append('<option value="">Select Revision</option>');
                for (var i = 0; i < contentObj.targetRevisions[index].length; i++)
                    $('#targetTextArea__toolbar1').find('#ddlRevisionHistory_').append('<option value="' + encodeURIComponent(contentObj.targetRevisions[index][i]) + '">Revision' + i.toString() + '</option>');
                $('#targetTextArea__toolbar1').find('#ddlRevisionHistory_').css("display", "inline");
            }
        }

        //validates comments ddl options.
        function validateOptionsValuesList(optionsValues) {
            var validList = false;
            for (var k = 0; k < optionsValues.length; k++)
                if (optionsValues[k].phrase.length > 0)
                    return true;
            return validList;
        }

        //highlights all translation options for a given segment.
        $.addTargetOptions = function (sentenceIndex) {
           
            $(".targetOptionContextWrapper").remove();
            if ($.displayTranslationOptions && !isInteractiveCheckEnabled) {
                for (var i = 0; i < contentObj.tgt_sentences[sentenceIndex].options.length; i++) {
                    if (validateOptionsValuesList(contentObj.tgt_sentences[sentenceIndex].options[i].values))
                        $('#targetTextArea__ifr').contents().find('#tinymce').highlightTargetOptions(contentObj.tgt_sentences[sentenceIndex].options[i].context, "targetSpan_" + i.toString(), contentObj.tgt_sentences[sentenceIndex].options[i].values, i);
                }
            }

            //bind all events to hide context-menus.
            $('#targetTextArea__ifr').contents().find('html').click(function () {
                $(".targetOptionContextWrapper").css('display', 'none');
            });
            $('#postEditDialog_').click(function () {
                $(".targetOptionContextWrapper").css('display', 'none');
            });
            //bind all events related with target options.
            $('#targetTextArea__ifr').contents().find('#tinymce SPAN').mouseover(function () {
                $(this).css("background-color", "yellow");
                $(this).css("cursor", "pointer");
            }).mouseout(function () {
                $(this).css("background-color", "");
                $(this).css("cursor", "");
            }).click(function (e) {
                $(".targetOptionContextWrapper").css('display', 'none');
                var spanOffset = $(this).offset();
                var iFrameOffset = $(document.body).contents().find('#targetTextArea__ifr').offset();
                var left = iFrameOffset.left + spanOffset.left;
                var top = iFrameOffset.top + spanOffset.top
                var splittedId = this.id.split('_');
                $("#targetContextMenu_" + splittedId[1] + "_" + splittedId[2]).css('top', (top + 15));
                $("#targetContextMenu_" + splittedId[1] + "_" + splittedId[2]).css('left', left);
                $("#targetContextMenu_" + splittedId[1] + "_" + splittedId[2]).css('display', 'block');
                e.stopPropagation();
            });
        }

        //creates the guidelines jquery ui dialog.
        function createGuideLinesDialog() {
            $('#guideLinesDialog_').dialog("destroy");
            $('#guideLinesDialog_').dialog();
        }

        //creates the dialog prompted when user wants to finish the edition task.
        function createCloseDialog() {
            $('#closeDialog_').dialog("destroy");
            $("#closeDialog_").dialog({
                modal: false,
                buttons:
                 [{
                     id: "btn-yes_",
                     text: $.labelConfirmationYes.toString(),
                     click: function () {
                         $(this).dialog("close");
                         //if the document has a final question configured.
                         if ($.question != "" && $.questionId != "") {

                             $('#completeQuestionDialog_').dialog({
                                 modal: false,
                                 buttons: [
                                {
                                    id: "btn-done_",
                                    text: $.labelQuickAnswerDone.toString(),
                                    click: function () {
                                        //check if reply has something within itself.
                                        if ($.trim($("#QuickQuestionTextArea_").val())) {
                                            $.completeDocument($("#QuickQuestionTextArea_").val());
                                        }
                                        $(this).dialog("close");
                                    }
                                }]
                             });
                         } else {
                             $.completeDocument("");
                         }
                     }
                 },
                {
                    id: "btn-no_",
                    text: $.labelConfirmationNo.toString(),
                    click: function () {

                        $(this).dialog("close");
                    }
                }

                 ]
            });

        }

        //injects in the page the pagination hidden html fields, those act as controllers as in which segment the user is.
        function injectPaginationFields() {
            $(document.body).append('<input type="hidden" id="current_page" />');
            $(document.body).append('<input type="hidden" id="show_per_page" />');
        }

        //injects in the page the html used to later on generate the help jquery ui dialog.
        function injectHelpButtonDialog() {
            $(document.body).append('<div id="helpPostDialog_" title="' + $.labelHelp.toString() + '" style="display:none; text-align: justify;">' + $.htmlDialogHelp.toString() + '</div>');
        }

        //injects in the page the html used to generate the main jquery ui dialog.
        function injectMainDialog() {

            $(document.body).append('<div id="postEditDialog_" title="' + $.labelEdit.toString() + '" style="display:none;"> <div class="container" id="divLoadingContainer" style="vertical-align: middle;text-align: center;height: 100%;width: 100%/*auto*/;"><img alt="" src="' + settings.imagesPath + '/ajax-loader_post.gif" style="vertical-align: middle;text-align: center;margin-top: 15%;" /></div>' +
            '<div class="container" id="divDocumentBlockedContainer" style="vertical-align: middle;text-align: center;width: 100%/*auto*/;height: 100%;display:none;"><span id="spnBlockedMessage_" style="vertical-align: middle;text-align: center;margin-top: 15%;height:100%;font-size: larger;"></span></div>' +
            ' <div id="divMain_" style="display:none;"></div>  <div id="divSourceMain_" style="display:none;"></div>  <div class="container" id="divMainContainer" style="display:none;/*width: auto;*/">  <div class="left"><span><b id="labelClickOnTextToEdit_">' + $.labelClickOntextToEdit.toString() + '</b></span><div id="wrapper"> <div id="editedContent_" style="height:' + settings.leftPaneHeight + ';width:' + settings.leftPaneWidth + ';font-size:' + settings.leftPaneFontSize + ';" class="scrollingDiv"></div></div></div><div class="middle"></div><div class="right" style="width:100%;"><div id="divSourceTextContainer_" style="display:none;">' +
            '<span style="display:block;"><b><span id="labelOriginalSentence_">' + $.labelOriginalSentence.toString() + '</span><span class="slider-frame" style="float: right;margin-bottom:5px;"><span style="font-size:' + "0.7em" + ';" class="slider-button" id="switcherButton_"></span></span></b></span>' +
            '<textarea title="' + $.labelSourceTextTitle.toString() + '"  class="source-text-area" id="sourceTextArea_" style="min-height: 100px;font-size:' + settings.leftPaneFontSize + ';width:' + settings.textAreasWidth + '; margin:0; padding:0;height:' + settings.textAreasHeight + ';background-color:#F0F0EE;padding-bottom:5px" readonly="readonly"></textarea>' +
            '</div>' +
            '<div id="divTargetTextContainer">' +
            '<span style="display:block;margin-bottom:15px;"><b id="currentSentenceToEditLabel_">' + $.labelCurrentSentenceToEdit.toString() + '</b></span>' +
            '<textarea title="' + $.labelTargetTextTitle.toString() + '" class="targetTextArea" id="targetTextArea_" style="font-size:' + settings.leftPaneFontSize + ';width:' + settings.textAreasWidth + '; margin:0; padding:0;height:' + settings.textAreasHeight + ';" ></textarea>' +
            '</div>' +
            '<div id="divOptions" style="width:' + settings.textAreasWidth + ';">' +
            '<!--<div style="padding-top: 20px;" id="page_navigation"></div>-->' +
            '<div style="padding-top: 10px;" id="checkOptions_"><span id="page_navigation" style="float:right;"></span> <div style="display:none"> <span style="float:right;"><input type="button" id="btnSave_" title="Save" value="Save" /></span><span style="float:right;padding-right:5px;padding-top:5px;"> Auto Save? </span><span style="float:right;padding-top:5px;"><input id="autoSaveCheckBox_" type="checkbox" title="Auto Save"  /></span></div></div>' +
            '<!--<div  style="padding-top: 10px;"><span><input id="autoSaveCheckBox_" title="Auto Save" type="checkbox"  /></span><span> Auto Save ?</span></div>-->' +
            '</div>' +
            '<div id="divComments" style="padding-top:20px;width:' + settings.textAreasWidth + ';">' +
            '<span><b id="labelComments_">' + $.labelComments.toString() + '</b> <select id="notesSelector_" style="margin:0px;display:none;font-size:' + settings.leftPaneFontSize + ';border: 1px solid grey;" > </select></span> ' +
            '<textarea title="' + $.labelCommentsTitle.toString() + '" id="commentsTextArea_" style="font-size:' + settings.leftPaneFontSize + ';width:' + settings.textAreasWidth + '; margin:0; padding:0;height:' + settings.textAreasHeight + ';border: 1px solid grey;z-index:99999;"></textarea> ' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<!----><span id="spanPostEditRealtimeCheck_" style="display:none;"></span><span id="spanPostEditRealtimeCheckTargetText_" style="display:none;"></span>' +
            '');
        }

        //injects in the page the html used to generate the main jquery ui dialog.
        function injectMainDialogMonolingual() {
            $(document.body).append('<div id="postEditDialog_" title="' + $.labelEdit.toString() + '" style="display:none;"> <div class="loadmask"  style="position:relative; display:block; vertical-align:middle; text-align:center;top:30%"> <img alt="Please Wait..." src="' + settings.imagesPath + '/ajax-loader.gif" /> </div> <div id="divMain_" style="display:none;"></div>  <div id="divSourceMain_" style="display:none;"></div>  <div class="container" style="width: auto;">  <div class="left"><span><b id="labelClickOnTextToEdit_" >' + $.labelClickOntextToEdit.toString() + '</b></span><div id="wrapper"> <div id="editedContent_" style="height:' + settings.leftPaneHeight + ';width:' + settings.leftPaneWidth + ';" class="scrollingDiv"></div></div></div><div class="middle"></div><div class="right" style="width:100%;"><div id="divSourceTextContainer_" style="display:none;">' +
         '<span style="display:block;"><b id="labelOriginalSentence_">' + $.labelOriginalSentence.toString() + '</b></span>' +
         '<textarea title="' + $.labelSourceTextTitle.toString() + '" class="source-text-area" id="sourceTextArea_" style="min-height: 100px;font-size:' + settings.leftPaneFontSize + ';width:' + settings.textAreasWidth + '; margin:0; padding:0;height:' + settings.textAreasHeight + ';" readonly="readonly"></textarea>' +
         '</div>' +
         '<div id="divTargetTextContainer">' +
         '<span><b id="currentSentenceToEditLabel_">' + $.labelCurrentSentenceToEdit.toString() + '</b></span>' +
         '<textarea title="' + $.labelTargetTextTitle.toString() + '" class="targetTextArea" id="targetTextArea_" style="font-size:' + settings.leftPaneFontSize + ';width:' + settings.textAreasWidth + '; margin:0; padding:0;height:' + settings.textAreasHeight + ';" ></textarea>' +
         '</div>' +
         '<div id="divOptions" style="width:' + settings.textAreasWidth + ';">' +
         '<!--<div style="padding-top: 20px;" id="page_navigation"></div>-->' +
         '<div style="padding-top: 10px;" id="checkOptions_"><span id="page_navigation" style="float:right;"></span><div style="display:none"> <span style="float:right;"><input type="button" id="btnSave_" title="Save" value="Save" /></span><span style="float:right;padding-right:5px;padding-top:5px;"> Auto Save? </span><span style="float:right;padding-top:5px;"><input id="autoSaveCheckBox_" type="checkbox" title="Auto Save"  /></span></div></div>' +
         '<!--<div  style="padding-top: 10px;"><span><input id="autoSaveCheckBox_" title="Auto Save" type="checkbox"  /></span><span> Auto Save ?</span></div>-->' +
         '</div>' +
         '<div id="divComments" style="padding-top:20px;width:' + settings.textAreasWidth + ';">' +
         '<span><b id="labelComments_">' + $.labelComments.toString() + '</b></span> <select id="notesSelector_" style="margin:0px;display:none;font-size:' + settings.leftPaneFontSize + ';border: 1px solid grey;" > </select>' +
         '<textarea title="' + $.labelCommentsTitle.toString() + '" id="commentsTextArea_" style="width:' + settings.textAreasWidth + '; margin:0; padding:0;height:' + settings.textAreasHeight + ';border: 1px solid grey;z-index:99999;"></textarea> ' +
         '</div>' +
         '</div>    ' +
         '</div>    ' +
         '<!----></div>');

        }

        //injects in the page the html used to generate the guidelines jquery ui dialog. 
        function injectGuidelinesDialog() {
            $(document.body).append('<div style="display:none;" id="guideLinesDialog_" title="' + $.labelGuidelinesTitle.toString() + '">' + $.htmlBilingualGuidelines.toString() + '</div>')
        }

        //injects in the page the html used to generate the jquery ui dialog prompt when user ponder to finish the edition task. 
        function injectCloseMenusDialogs() {
            $(document.body).append('<div style="display:none;" id="closeDialog_" title="' + $.labelConfirmationNeeded.toString() + '"><p>' + $.labelConfirmationText.toString() + '</p></div>');
        }

        //injects in the page the html used to generate the jquery ui dialog prompt when user decides to finish the edition task. 
        function injectFinalQuestionDialog() {
            $(document.body).append('<div style="display:none;" id="completeQuestionDialog_" title="' + $.labelQuickQuestionTitle.toString() + '">	<p id="quickQuestion_"></p><textarea id="QuickQuestionTextArea_" style="width:250px; margin:0; padding:0;height:80px;border:0px;"></textarea>	</div>');
        }

        //injects in the main page all needed html.
        function injectHTML() {
            injectPaginationFields();
            injectMainDialog();
            injectGuidelinesDialog();
            injectCloseMenusDialogs();
            injectFinalQuestionDialog();
            injectHelpButtonDialog();
        }

        //when the switch button is used, this method will add that info under the ongoing phase(can be think or edition phase) metadata.
        function addSwitchAction() {
            //gives the index of the segment.
            var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);
            //gives the index of the last revision of the segment. 
            var currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
            if (isNewPhaseCreatedForThisRevision) {
                translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].switchTimeStampList.push(new Date());
                translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].processName = $.processName;

                //meaning this is the first switch after the default one(at project level is possible to set the source visible or hidden).
                if (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].switchTimeStampList.length == 2)
                    translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].startSwitch = $.processName == "bilingual" ? "show" : "hide";
            }
            else {
                //if no segment revision is created by checking the flag 'isNewPhaseCreatedForThisRevision' we assume a thinking phase is on going.
                if (!$.lockCustomInterfacePhaseCreation) {
                    currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases.length - 1);
                    //the start time for the first think-phase is set when the actual phase is created.
                    translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].switchTimeStampList.push(new Date());
                }
                $.lockCustomInterfacePhaseCreation = false;
            }
        }

        //binds events to handle showing/hiding the source text.
        $.bindsSwitchButtonBehaviour = function () {
            $('#switcherButton_').unbind();
            $.lockCustomInterfacePhaseCreation = true;
            if ($.configurationId == "2") {
                $("#sourceTextArea_").css("display", "none");
                $('#switcherButton_').toggle(function () {
                    $("#sourceTextArea_").css("display", "none");
                    $("#labelOriginalSentence_").css("display", "none");
                    $(this).removeClass('on').html($.labelShowSource);
                    $.processName = "monolingual";
                    setTimeout(function () { $('#postEditDialog_').scrollTop(0); }, 200);
                    addSwitchAction();
                }, function () {
                    $(this).addClass('on').html($.labelHideSource);
                    $("#sourceTextArea_").css("display", "block");
                    $("#labelOriginalSentence_").css("display", "inline");
                    $.processName = "bilingual";
                    setTimeout(function () { $('#postEditDialog_').scrollTop(0); }, 200);
                    addSwitchAction();
                });
            }
            else {
                $("#sourceTextArea_").css("display", "block");
                $('#switcherButton_').toggle(function () {

                    $(this).addClass('on').html($.labelHideSource);
                    $("#sourceTextArea_").css("display", "block");
                    $("#labelOriginalSentence_").css("display", "inline");                   
                    $.processName = "bilingual";
                    setTimeout(function () { $('#postEditDialog_').scrollTop(0); }, 200);
                    addSwitchAction();
                }, function () {

                    $("#sourceTextArea_").css("display", "none");
                    $("#labelOriginalSentence_").css("display", "none");
                    $(this).removeClass('on').html($.labelShowSource);                 
                    $.processName = "monolingual";
                    setTimeout(function () { $('#postEditDialog_').scrollTop(0); }, 200);
                    addSwitchAction();
                });
            }

            $("#divSourceTextContainer_").css("display", "inline");
            $("#divSourceTextContainer_ .slider-frame").css("display", "block");

            $('#switcherButton_').trigger('click');
        }

        //inits some ui components(comments ddl, final question, show/hide source text).
        function initMiscellaneousUiComponents() {
           
            $("#quickQuestion_").text("");
            $("#notesSelector_").html("");
            $("#notesSelector_").css("display", "none");
            if ($.customInterface == 1) {
                $.bindsSwitchButtonBehaviour();
            }
            else {
                if ($.configurationId == "2")
                    $("#divSourceTextContainer_").css("display", "none");
                else {
                    $("#divSourceTextContainer_").css("display", "inline");
                    $("#divSourceTextContainer_ .slider-frame").css("display", "none");
                }
            }

            if ($.question != "" && $.questionId != "") {
                $("#quickQuestion_").text($.question);
            }

            if ($.editOptions != null && $.editOptions.length > 0) {
                for (var i = 0; i < $.editOptions.length; i++)
                    $("#notesSelector_").append('<option value="' + $.editOptions[i] + '">' + $.editOptions[i] + '</option>');


                $("#notesSelector_").css("display", "inline");
            }

        }

        //binds to the document(global JS object) events to handle segment navigation using hot keys when the mouse scope is not the jquey ui dialog.
        function bindDocumentHotkeys() {
            $(document).keydown(function (e) {
                if ($('#postEditDialog_').is(":visible")) {

                    if (e.keyCode === 16)
                        shift = true;
                }
            });
            $(document).keyup(function (e) {
                if ($('#postEditDialog_').is(":visible")) {
                    handleShiftTab(e)
                }
            });
        }

        //handles hot keys actions of moving to the next segment(tab) or previous segment(shift+tab).
        function handleShiftTab(event) {
            if (event.keyCode === 9 && shift) {
                $.previous('editedContent_');
                return true;
            }
            else
                if (event.keyCode === 9 && !shift) {
                    $.next('editedContent_');
                    return true;
                }
            //avoid to record the shift button release(user stops pressing it).
            if (event.keyCode === 16) {
                shift = false;
                return true;
            }


            return false;
        }

        //displays a given message to user.
        function displayToolbarMessage(innerHtml) {
            setTimeout(function () { $('#postEditDialog_').scrollTop(0); }, 200);
            $("#footerDialog").html(innerHtml);
            var $placeHolder = $(document).find(".ui-dialog-titlebar");
            var pos = $placeHolder.position();         
            $("#footerDialog").css({
                position: "absolute",
                top: (pos.top) + "px",
                left: (pos.left) + "px"
            }).fadeIn("slow");             
            setTimeout(function () { $("#footerDialog").hide(); $("#footerDialog").html(""); }, settings.commentsCleanDisplayPeriod);
        }

        //creates tiny mce editor for over target text-area(where edition takes place).
        function loadTextEditor(preEditTargetLanguage) {
            $('#targetTextArea_').tinymce({
                menubar: false,
                statusbar: true,
                resize: 'both',
                toolbar: "separator,undo,redo,separator",
                entity_encoding: "raw",
                plugins: "",
                resizing: false,
                toolbar_location: "bottom",
                align: "center",
                location: "",
                entity_encoding: "raw",
                paste_postprocess: function (pl, o) {
                    // remove extra line breaks.
                    o.node.innerHTML = o.node.innerHTML.replace(/&nbsp;/ig, " ");
                },
                setup: function (ed) {
                    ed.on('KeyDown', function (e) {
                    
                        if (e.keyCode === 16)
                            shift = true;
                    }),
                     ed.on('KeyUp', function (e) {
                         if (!handleShiftTab(e)) {

                             //the pool index starts from zero and the global position start from one.
                             var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);
                             //means the user is on a new segment, so a new Phase object needs to be created.
                             if (!isNewPhaseCreatedForThisRevision) {
                                 //think phase.
                                 saveThinkPhase(translationUnitsPool[currentTranslationUnitArrayIndex]);
                                 var newPhase = new Phase(buildPhaseNameString(globalCurrentTranslationUnitIndex, (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount + 1)), $.processName, new Date(), $.jobId, $.currentUserId, $.tool, $.tooldId);
                                 translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.push(newPhase);
                                 ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount;
                                 isNewPhaseCreatedForThisRevision = true;
                                 $("#commentsTextArea_").val("");
                                 $('#notesSelector_>option:nth-child(1)').attr('selected', true);
                                 displayToolbarMessage('<span style="color:#0e9e4c;display:inline;vertical-align: middle;text-align: center;"><b>' + $.messageCommentsDeleted + '</b></span>');
                             }

                             var currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
                             //new metric for time frame indicating when user actually started to type some text.
                             if (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].startTyping == null)
                                 translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].startTyping = new Date();

                             switch (e.keyCode) {
                                 case 8: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfDeleteKeysPressed; } break;
                                 case 46: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfDeleteKeysPressed; } break;
                                 case 32: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfWhiteKeysPressed; } break;
                                 case 35: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfArrowKeysPressed }; break;
                                 case 36: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfArrowKeysPressed }; break;
                                 case 37: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfArrowKeysPressed }; break;
                                 case 38: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfArrowKeysPressed }; break;
                                 case 39: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfArrowKeysPressed }; break;
                                 case 40: { ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfArrowKeysPressed }; break;
                                 default:
                                     {
                                         //non white key pressed.
                                         var inp = String.fromCharCode(e.keyCode);
                                         if (/[a-zA-Z0-9-_‘@,.;:!"“”£$%^&*()+={}\][<>~]/.test(inp)) {
                                             ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfNonWhiteKeysPressed;
                                         }
                                     } break;
                             }

                             //total number of keys pressed.
                             ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfKeysPressed;

                         }

                     });

                },
                init_instance_callback: function (ed) {
                    $.AcceptTinyMceEditor = ed;
                    ed.on('Undo', function (man, level) {
                      
                        if (isParaphrasingEnabled)
                            cleanParaphrasing(true);
                        else
                            if ($.displayTranslationOptions && !isInteractiveCheckEnabled)
                                $.addTargetOptions(globalCurrentTranslationUnitIndex - 1);

                        undo = level;
                    });
                    ed.on('Redo', function (man, level) {

                        if (isParaphrasingEnabled)
                            cleanParaphrasing(true);
                        else
                            if ($.displayTranslationOptions && !isInteractiveCheckEnabled)
                                $.addTargetOptions(globalCurrentTranslationUnitIndex - 1);
                        redo = level;

                    });
                }
            });
        }

        //cleans all plug-in related data.
        function cleanPluginData() {
            try {
                $('#postEditDialog_').find("#footerDialog").remove();
                $(".targetOptionContextWrapper").css('display', 'none');
                $('#postEditDialog_').removeData();
                $('.dialog-extend-css').remove();
                $('#targetTextArea_').dialog("close");
                $('#targetTextArea_').dialog("destroy");
                $('#editedContent_').empty();
                $('#divMain_').empty();
                $('#autoSaveCheckBox_').attr('checked', false);
                $(".targetOptionContextWrapper").remove();
                $('#divSourceMain_ P').remove();
                try { tinyMCE.get('targetTextArea_').remove(); } catch (e) { }
                $("#divMainContainer").css("display", "none");
                $("#divDocumentBlockedContainer").css("display", "none");
                $("#divLoadingContainer").css("display", "block");
                $("#divLoadingContainer").css("display", "block");
                $("#divDocumentBlockedContainer").css("display", "none");
                $("#divMainContainer").css("display", "none");

                $("#htmlPlaceHolderRealTimeDiv_").remove();
                $.clearPreEditRealtimeCheckData(true);

                $('#postEditDialog_').dialog('destroy');
                $('#postEditDialog_').unbind();
            } catch (e) {
            }
        }

        //clear all known context menus from the screen.
        function clearContextMenus() {
            $(".targetOptionContextWrapper").css('display', 'none'); $(".acm-default").css('display', 'none');
        }
    

        //jumps user to  previous segment.
        $.previous = function (paginationContainerId) {
            new_page = parseInt($('#current_page').val()) - 1;
            //if is there an item before the current active link run the function.
            if ($('.active_page').prev('.page_link').length == true) {
                goToPage(new_page, paginationContainerId);
            }
        }

        //jumps user to next segment.
        $.next = function (paginationContainerId) {
            new_page = parseInt($('#current_page').val()) + 1;
            //if is there an item after the current active link run the function.
            if ($('.active_page').next('.page_link').length == true) {
                goToPage(new_page, paginationContainerId);
            }
        }

        //creates a new think-phase object and stores it under the segment pool.
        function createThinkPhase(revisionIndex) {
            var currentTranslationUnitArrayIndex = revisionIndex;
            if (translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases.length > 0)
                if (translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitThinkPhasesCount - 1].alreadySent == false)
                    return;
            var newThinkPhase = new Phase(buildThinkPhaseNameString((revisionIndex + 1), (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitThinkPhasesCount + 1)), $.processName, new Date(), $.jobId, $.currentUserId, $.tool, $.tooldId);
            translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases.push(newThinkPhase);
            ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitThinkPhasesCount;
            isNewThinkingPhaseCreatedForThisRevision = true;
        }

        //checks if is there any pending think-phase and if that's the case sends(ajax) it over to the back-end system for recording.
        function saveThinkPhase(translationUnit) {
            try {               
                if (translationUnit.thinkPhases[(translationUnit.translationUnitThinkPhasesCount - 1)].alreadySent == false) {
                    translationUnit.thinkPhases[(translationUnit.translationUnitThinkPhasesCount - 1)].phaseEndTime = new Date();
                    var jsonForCompletePhaseList = buildCompleteTranslationRevisionPhaseJSON($.textId, $.currentUserId, translationUnit.index, new Date(), translationUnit.state, translationUnit.source, translationUnit.target, translationUnit.thinkPhases[(translationUnit.translationUnitThinkPhasesCount - 1)], buildCountsList(translationUnit.thinkPhases[(translationUnit.translationUnitThinkPhasesCount - 1)]));
                    if (jsonForCompletePhaseList != null && jsonForCompletePhaseList.length > 0) {
                        $.submitRevision(jsonForCompletePhaseList);                     
                    }
                    $.globalThinkPhaseInitTime = new Date();
                    translationUnit.thinkPhases[(translationUnit.translationUnitThinkPhasesCount - 1)].alreadySent = true;
                }
            }
            catch (e) { }
        }

        //checks if is there any pending edition-phase and if that's the case sends(ajax) it over to the back-end system for recording. A think-phase might be then created.
        function saveEditionPhase(translationUnit, createThinkPhase) {
            try {
                if (translationUnit.translationUnitPhases[(translationUnit.translationUnitPhasesCount - 1)].alreadySent == false) {
                    var jsonForCompletePhaseList = buildCompleteTranslationRevisionPhaseJSON($.textId, $.currentUserId, translationUnit.index, new Date(), translationUnit.state, translationUnit.source, translationUnit.target, translationUnit.translationUnitPhases[(translationUnit.translationUnitPhasesCount - 1)], buildCountsList(translationUnit.translationUnitPhases[(translationUnit.translationUnitPhasesCount - 1)]));
                    if (jsonForCompletePhaseList != null && jsonForCompletePhaseList.length > 0)
                        $.submitRevision(jsonForCompletePhaseList);
                    translationUnit.translationUnitPhases[(translationUnit.translationUnitPhasesCount - 1)].alreadySent = true;
                    if (createThinkPhase) {
                        createThinkPhase((globalCurrentTranslationUnitIndex - 1));
                    }
                }
            }
            catch (e) { }
        }

        //before closing the main jquery ui dialog a couple of actions are performed: like saving the last phase. 
        function saveBeforeExit() {
            //update global edition time.
            var uniqueSaveBeforeExitEndTime = $.globalEndTime = new Date();
            $.globalStartTime = new Date();
            $.globalEndTime = null;
            //index of the current segment(which in this case is also the last the user is going to edit).
            var currentArrayIndexForTranslationUnit = (globalCurrentTranslationUnitIndex - 1);
            //index of the last phase under the previous segment.
            var currentArrayIndexForTheLastPhaseAdded = (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length - 1);
            //ddl options persisting logic:
            //check if current segment has any comments of type "target" and "user", if it does not have them but the lastOption is > 0, then we need to persist the prior ddl selection.
            var currentAnnotatesFromUserIndex = -1;
            if (isNewPhaseCreatedForThisRevision) {
                currentAnnotatesFromUserIndex = $.checkNoteCriteria(translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseNotes, "target", "user");
                if (translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment > 0 && currentAnnotatesFromUserIndex < 0)
                    translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseNotes.push(new Note("target", 'user', str));
            }
            else {
                currentAnnotatesFromUserIndex = $.checkNoteCriteria(translationUnitsPool[currentArrayIndexForTranslationUnit].thinkPhases[translationUnitsPool[currentArrayIndexForTranslationUnit].thinkPhases.length - 1].phaseNotes, "target", "user");
                if (translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment > 0 && currentAnnotatesFromUserIndex < 0)
                    translationUnitsPool[currentArrayIndexForTranslationUnit].thinkPhases[translationUnitsPool[currentArrayIndexForTranslationUnit].thinkPhases.length - 1].phaseNotes.push(new Note("target", 'user', str));
            }

            //add any notes from the comments box.      
            if ($.trim($("#commentsTextArea_").val()).length > 0) {
                //instead of create a new segment revision for this pending Note we add it to the current think phase.
                if (isNewPhaseCreatedForThisRevision) {
                    translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment = $("#commentsTextArea_").val();
                    translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseNotes.push(new Note("general", "user", $("#commentsTextArea_").val()));
                }
                else {
                    translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment = $("#commentsTextArea_").val();
                    translationUnitsPool[currentArrayIndexForTranslationUnit].thinkPhases[translationUnitsPool[currentArrayIndexForTranslationUnit].thinkPhases.length - 1].phaseNotes.push(new Note("general", "user", $("#commentsTextArea_").val()));
                }

                //always need to update the last comment for each segment.
                translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment = $("#commentsTextArea_").val();

                $("#commentsTextArea_").val("");
            }

            if (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length > 0) {
                //updates the last phase of the last segment with the final timestamp (phaseEndTime).
                translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseEndTime = uniqueSaveBeforeExitEndTime;
                //updates the translation unit object with the last text edition within the target text-area.
                translationUnitsPool[currentArrayIndexForTranslationUnit].target = $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">");
                //submitting the last edition phase to the server       
                saveEditionPhase(translationUnitsPool[currentArrayIndexForTranslationUnit], false);
            }

            //think phase.            
            saveThinkPhase(translationUnitsPool[currentArrayIndexForTranslationUnit]);

        }

        //one of the core methods, responsible to navigate to  a specific segment, handling several actions during the process(such as recording any pending edition or thinking phase).
        function goToPage(page_num, paginationContainerId) {

            //reset unde/redo manager.
            try { $.AcceptTinyMceEditor.undoManager.clear(); } catch (e) { }

            $('#notesSelector_>option:nth-child(1)').attr('selected', true);
            var previousIndexHelper = $('#editedContent_ DIV.postedit-highlight').attr("id").split('_');
            globalPreviousTranslationUnitIndex = parseInt(previousIndexHelper[1]);
            //global pagination index starts in zero.
            globalCurrentTranslationUnitIndex = page_num + 1;

            //handle any pending think phase.
            if (globalPreviousTranslationUnitIndex != globalCurrentTranslationUnitIndex) {
                //the second condition protects the comment to be assigned to a non existing think phase.
                if ($.trim($("#commentsTextArea_").val()).length > 0 && translationUnitsPool[globalPreviousTranslationUnitIndex - 1].thinkPhases[(translationUnitsPool[globalPreviousTranslationUnitIndex - 1].translationUnitThinkPhasesCount - 1)].alreadySent == false) {
                    if (!isNewPhaseCreatedForThisRevision)
                        translationUnitsPool[globalPreviousTranslationUnitIndex - 1].thinkPhases[translationUnitsPool[globalPreviousTranslationUnitIndex - 1].thinkPhases.length - 1].phaseNotes.push(new Note("general", "user", $("#commentsTextArea_").val()));
                    translationUnitsPool[globalPreviousTranslationUnitIndex - 1].lastComment = $("#commentsTextArea_").val();
                    //comments reset.
                    $("#commentsTextArea_").val("");
                }

                //check if there are any forgotten notes from the comments ddl left behind to add to the current revision, before move segment.
                if (translationUnitsPool[globalPreviousTranslationUnitIndex - 1].lastOption.length > 0) {
                    var currentAnnotatesFromUserIndex = $.checkNoteCriteria(translationUnitsPool[globalPreviousTranslationUnitIndex - 1].thinkPhases[translationUnitsPool[globalPreviousTranslationUnitIndex - 1].thinkPhases.length - 1].phaseNotes, "target", "user");
                    if (currentAnnotatesFromUserIndex < 0)
                        translationUnitsPool[globalPreviousTranslationUnitIndex - 1].thinkPhases[translationUnitsPool[globalPreviousTranslationUnitIndex - 1].thinkPhases.length - 1].phaseNotes.push(new Note("target", 'user', translationUnitsPool[globalPreviousTranslationUnitIndex - 1].lastOption));
                }

                //refreshing revisions history ddl with the new segment revisions(all prior to the one just started).
                //$.updateRevisionHistory(page_num);
            }

            saveThinkPhase(translationUnitsPool[globalPreviousTranslationUnitIndex - 1]);
            createThinkPhase(page_num);

            //refreshing comments dll with prior selected ddl comment(if is there one...).
            $.changeOptionsSelector(translationUnitsPool[globalCurrentTranslationUnitIndex - 1].lastOption);

            //if previous index and current index are different then means the user is probably about to enter in a new revision cycle.
            if (globalPreviousTranslationUnitIndex != globalCurrentTranslationUnitIndex) {
                //index of the last segment.
                var currentArrayIndexForTranslationUnit = (globalPreviousTranslationUnitIndex - 1);
                //index of the last phase under the previous segment.
                var currentArrayIndexForTheLastPhaseAdded = (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length - 1);

                //check if there are any forgotten notes from the comments ddl left behind to add to the current revision, before move segment.
                if (translationUnitsPool[currentArrayIndexForTranslationUnit].lastOption.length > 0 && isNewPhaseCreatedForThisRevision) {
                    var currentAnnotatesFromUserIndex = $.checkNoteCriteria(translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseNotes, "target", "user");
                    if (currentAnnotatesFromUserIndex < 0)
                        translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseNotes.push(new Note("target", 'user', translationUnitsPool[currentArrayIndexForTranslationUnit].lastOption));
                }

                //adds any pending comments within the comments text-area.       
                if ($.trim($("#commentsTextArea_").val()).length > 0) {
                    translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseNotes.push(new Note("general", "user", $("#commentsTextArea_").val()));
                    translationUnitsPool[currentArrayIndexForTranslationUnit].lastComment = $("#commentsTextArea_").val();
                    //comments reset.
                    $("#commentsTextArea_").val("");
                }

                if (translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases.length > 0) {
                    //updates the last phase of the last segment with the final timestamp (phaseEndTime)
                    translationUnitsPool[currentArrayIndexForTranslationUnit].translationUnitPhases[currentArrayIndexForTheLastPhaseAdded].phaseEndTime = new Date();
                    //updates the translation unit object with the last text in the target text area (like we do on the right column)
                    translationUnitsPool[currentArrayIndexForTranslationUnit].target = $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">");
                    //submits the last phase revision to the server       
                    saveEditionPhase(translationUnitsPool[currentArrayIndexForTranslationUnit], true);
                }

                isNewPhaseCreatedForThisRevision = false;
                $('#postEditDialog_').scrollTop(0);
            }

            //records target if auto-save is checked, currently is always true.
            if ($('#autoSaveCheckBox_').is(":checked")) {
                try {
                    var textSegment = $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">");
                    if (textSegment.length == 0)
                        textSegment = $.labelEmptySegment;
                    $('#editedContent_ DIV.postedit-highlight').text(textSegment);
                }
                catch (ex) { }
            }

            //get the number of items shown per page.              
            var show_per_page = parseInt($('#show_per_page').val());

            //get the element number where to start the slice from.
            var start_from = page_num * show_per_page;

            //get the element number where to end the slice.
            var end_on = start_from + show_per_page;

            //highlights the proper element.
            $('#' + paginationContainerId).find("div").removeClass('postedit-highlight').slice(start_from, end_on).addClass('postedit-highlight');

            //gets the page link that has longdesc attribute of the current page and add active_page class to it and remove that class from previously active page link.
            $('.page_link[longdesc=' + page_num + ']').addClass('active_page').siblings('.active_page').removeClass('active_page');

            //update the current page hidden input field.
            $('#current_page').val(page_num);

            displayActiveParagraphs(paginationContainerId);
        }

        //for a specific segment(it is called only at the very end of the goToPage method, it identifies the segment by the css class), it performs several actions(including updating the target text-area with the segment text and refreshing the comments ddl.   
        function displayActiveParagraphs(paginationContainerId) {
            $('#editedContent_').find('DIV.postedit-highlight').each(function () {
                var spanIdSplitted = $(this).attr('id').split('_');
                //updates comments text-area with the last comment for the current segment.
                $("#commentsTextArea_").val(translationUnitsPool[(globalCurrentTranslationUnitIndex - 1)].lastComment);

                var newTartgetTextToDisplay = $(this).text();
                if (newTartgetTextToDisplay == $.labelEmptySegment)
                    $('#targetTextArea_').val("");
                else
                    $('#targetTextArea_').val(newTartgetTextToDisplay.replace("<", "&lt;").replace(">", "&gt;"));

                //updates text-area text.   
                if (isInteractiveCheckEnabled) {
                    //this method needs a fix to avoid render flags in segments already viewed.
                    if (!$("#spanParagraph_" + globalCurrentTranslationUnitIndex).attr("data-accept-isrendered"))
                    {
                        $("#spanParagraph_" + globalCurrentTranslationUnitIndex).attr("data-accept-isrendered", "1");
                        $.renderStandaloneResult((globalCurrentTranslationUnitIndex - 1), $("#targetTextArea__ifr").contents().find("#tinymce"));
                    }

                 
                    if (globalCurrentTranslationUnitIndex != globalPreviousTranslationUnitIndex) {
                        //need validation on if content actually changed...
                        $('#spanParagraph_' + globalPreviousTranslationUnitIndex.toString() + '').removeAttr("data-accept-isrendered");
                        $.updateAndRenderStandaloneResult((globalPreviousTranslationUnitIndex - 1), undefined);
                    }
                }

                //reset undo level.
                try { $.AcceptTinyMceEditor.execCommand("mceAddUndoLevel", false, null); } catch (e) { }

                //get the correspondent source sentence for the segment.
                var source = loadSource($(this).attr('id'));
                $('#sourceTextArea_').val(source);

                //update name of the text-area which contains the paragraph id
                $('#targetTextArea_').attr('name', 'targetTextAreaName_' + spanIdSplitted[1].toString());

                //check if the text-area is shown as updated (blue) or not (red)
                //checkIfTargetTextChanged();

                //will generate all translation options for the segment.
                if ($(document).find('#targetTextArea__ifr').length) {
                    $.addTargetOptions(parseInt(spanIdSplitted[1] - 1));
                }
                else {
                    var checkExistMain = setInterval(function () {
                        if ($(document).find('#targetTextArea__ifr').length) {
                            $.addTargetOptions(parseInt(spanIdSplitted[1] - 1));
                            clearInterval(checkExistMain);
                        }
                    }, 100);
                }
            });

            //
            $('#postEditDialog_').scrollTop(0);
        }

        //returns the source text of a given segment.
        function loadSource(segmentId) {
            var splittedTargetId = segmentId.split('_');
            return $('#divSourceMain_ #sourcePar_' + splittedTargetId[1]).text();
        }
   
        //builds a regex used to create the translation options. 
        function buildRegex(pat) {
            var regex;
            try {
                if (pat == "." || pat == "!" || pat == "?")
                    regex = new RegExp("\\b\\.", "g");
                else
                    regex = new RegExp("(^|\\W)" + pat.toString() + "\\W", "g");
            } catch (e) {
                regex = new RegExp("\\b\\.", "g");
            }
            return regex;
        }

        //post-edit specific highlight method for the translation options.
        jQuery.fn.highlightTargetOptions = function (pat, elementId, menuOptions, currentIndex) {
          
            //regular expression that will match the options set context.    
            var regex = buildRegex(pat);
            //when there are more than on context matched by the regular expression we need to create a new menu for each and give it a different id(in this case using ++menusCount).
            var menusCount = 0;
            var totalIndexHelper = 0;
            function innerHighlight(node, pat) {
                var skip = 0;
              
                if (node.nodeType == 3) {
                    var textInNode = node.data + " ";
                    while (m = regex.exec(textInNode)) {
                        //creates a new node within the text editor iframe connected to a new translation options context-menu.
                        var spannode;
                        var middlebit;
                        if (m.index == 0 && (node.data.substring(m.index, pat.length) == pat)) {
                            spannode = document.createElement("SPAN");
                            spannode.className = "highlightOption";
                            spannode.id = elementId + "_" + menusCount.toString() + "_" + totalIndexHelper.toString();
                            middlebit = node.splitText(m.index);
                            ++totalIndexHelper;
                        }
                        else {
                            var charAt = encodeURIComponent(node.data.charAt(m.index));
                            if (charAt == "%A0" || charAt == "%20") {
                                spannode = document.createElement("SPAN");
                                spannode.className = "highlightOption";
                                spannode.id = elementId + "_" + menusCount.toString() + "_" + totalIndexHelper.toString();
                                middlebit = node.splitText(m.index + 1);
                                ++totalIndexHelper;
                            }
                            else {
                                continue;
                            }
                        }
                        var endbit = middlebit.splitText(pat.length);
                        var middleclone = middlebit.cloneNode(true);
                        spannode.appendChild(middleclone);
                        middlebit.parentNode.replaceChild(spannode, middlebit);
                        //adds new context-menu for each new target option matched by the regex.
                        $(document.body).append('<div id="targetContextMenu_' + currentIndex.toString() + '_' + menusCount.toString() + '" class="targetOptionContextWrapper" style="display:none"><ul></ul></div>');
                        //adds all transaltion options available under the new context-menu.
                        for (var j = 0; j < menuOptions.length; j++)
                            $("#targetContextMenu_" + currentIndex.toString() + "_" + menusCount.toString() + " ul").append('<li id="targetOption_' + j.toString() + '_' + spannode.id.toString() + '">' + menuOptions[j].phrase + '</li>');

                        //bind all events related with translation options menus.
                        $("#targetContextMenu_" + currentIndex.toString() + "_" + menusCount.toString() + " ul li").click(function () {

                            //the pool index starts from zero and the global position start from one.
                            var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);
                            //means the user is on a new segment, so a new Phase object needs to be created.
                            if (!isNewPhaseCreatedForThisRevision) {
                                //saving any pending think phases.
                                saveThinkPhase(translationUnitsPool[currentTranslationUnitArrayIndex]);
                                var newPhase = new Phase(buildPhaseNameString(globalCurrentTranslationUnitIndex, (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount + 1)), $.processName, new Date(), $.jobId, $.currentUserId, $.tool, $.tooldId);
                                translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.push(newPhase);
                                ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount;
                                isNewPhaseCreatedForThisRevision = true;
                            }
                            var currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
                            ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfTranslationOptionsUsed;
                            var idCurrentTargetOption = spannode.id.split('_');
                            var listOfIndexes = [];
                            var context = pat;

                            var regex = buildRegex(pat);
                            while (m = regex.exec(translationUnitsPool[currentTranslationUnitArrayIndex].target + " ")) {

                                if (m.index > 0)
                                    listOfIndexes.push((m.index + 1));
                                else
                                    listOfIndexes.push((m.index));
                            }
                            var indexFinal = listOfIndexes[idCurrentTargetOption[2]];
                            translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].phaseNotes.push(new Note("target", "trans_options", '' + $('#targetTextArea__ifr').contents().find("#" + spannode.id).text() + '|||' + $(this).text() + '|||' + indexFinal.toString() + "|||" + $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">")));
                            $('#targetTextArea__ifr').contents().find("#" + spannode.id).text($(this).text());
                            $(".targetOptionContextWrapper").css('display', 'none');
                        });

                        //updates the menus counter.
                        ++menusCount;
                    }
                    skip = 1;
                }
                else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                    for (var i = 0; i < node.childNodes.length; ++i) {
                        i += innerHighlight(node.childNodes[i], pat);
                    }
                }
                return skip;
            }
            return this.each(function () {                
                innerHighlight(this, pat);
            });
        };

        //remove all highlighted nodes.
        jQuery.fn.removeHighlightTargetOptions = function () {
            return this.find("span.highlightOption").each(function () {
                this.parentNode.firstChild.nodeName;
                with (this.parentNode) {
                    replaceChild(this.firstChild, this);
                    normalize();
                }
            }).end();
        };

        //create node to highlight.
        jQuery.fn.highlightParaphrasing = function (pat, startpos, elementtype, classname, spnid) {

            var indexcount = 0;
            var found = false;
            function innerHighlight(node, pat, startpos) {
                var skip = 0;
                if ($.browser.msie && $(node).attr('class') == 'accept-container-line-separator') {
                    indexcount = indexcount + 1;
                }
                if (node.nodeType == 3) {
                    var pos = node.data.toUpperCase().indexOf(pat);
                    if (pos >= 0) {
                        if (pos == startpos) {
                            addSplittedNode(node, pos, pat.length, elementtype, classname, spnid);
                            found = true;
                            skip = 1;
                        }
                        else {
                            if ((pos + indexcount) == startpos) {
                                addSplittedNode(node, pos, pat.length, elementtype, classname, spnid);
                                found = true;
                                skip = 1;
                            }
                            else {
                                var currentindexcount = (indexcount + pos + pat.length);
                                var aux = node.data.toUpperCase().substring((pos + pat.length), node.length);
                                var finalpos = pos + pat.length;
                                while (pos != -1) {
                                    pos = aux.indexOf(pat);
                                    finalpos = finalpos + pos;
                                    if ((pos + currentindexcount) == startpos) {
                                        addSplittedNode(node, finalpos, pat.length, elementtype, classname, spnid);
                                        skip = 1;
                                        found = true;
                                        break;
                                    }
                                    else {
                                        aux = aux.substring((pos + pat.length), aux.length);
                                        currentindexcount = (currentindexcount + pos + pat.length);
                                        finalpos = finalpos + pat.length;
                                    }
                                }
                                indexcount = (indexcount + parseInt(node.length));
                            }
                        }
                    }
                    else {
                        indexcount = (indexcount + parseInt(node.length));
                    }
                }
                else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                    for (var i = 0; i < node.childNodes.length; ++i) {

                        i += innerHighlight(node.childNodes[i], pat, startpos);
                        if (found)
                            break;
                    }
                }
                return skip;
            }
            return this.each(function () {
                innerHighlight(this, pat.toUpperCase(), startpos);
            });
        };

        //returns a string representing a think phase format("t1.1" means thinking phase number one in the first text segment).
        function buildThinkPhaseNameString(segmentIndex, revisionNumber) {
            return "t" + segmentIndex.toString() + "." + revisionNumber.toString();
        }

        //a bit nasty method that builds the JSON string for a new edition(either revision or thinking phases) phase(if you pick this code try to build the complete object first and then just serialize it using JSON.stringify method).
        function buildCompleteTranslationRevisionPhaseJSON(textId, userId, segmentIndex, timeStamp, state, source, target, currentPhase, listOfPhaseCounts) {
            if ($.userBrowser.msie) {
                var phaseDateString = currentPhase.date.getUTCFullYear() + "/" + (currentPhase.date.getUTCMonth() + 1) + "/" + currentPhase.date.getUTCDate() + " " + currentPhase.date.getUTCHours() + ":" + currentPhase.date.getUTCMinutes() + ":" + currentPhase.date.getUTCSeconds();
                var timeStampString = timeStamp.getUTCFullYear() + "/" + (timeStamp.getUTCMonth() + 1) + "/" + timeStamp.getUTCDate() + " " + timeStamp.getUTCHours() + ":" + timeStamp.getUTCMinutes() + ":" + timeStamp.getUTCSeconds();
                var targetStr = target.replace(/["]/g, "\\\"");
                var sourceStr = source.replace(/["]/g, "\\\"");
                var jsonData = '{"textId":"' + textId + '","userIdentifier":"' + userId + '",';
                jsonData = jsonData + '"index":' + segmentIndex + ',';
                jsonData = jsonData + '"timeStamp":"' + timeStampString + '",';
                jsonData = jsonData + '"phaseDate":"' + phaseDateString + '",';
                jsonData = jsonData + '"state":"' + state + '",';
                jsonData = jsonData + '"source":"' + sourceStr + '",';
                jsonData = jsonData + '"target":"' + targetStr + '",';
                jsonData = jsonData + '"phase":{';
                jsonData = jsonData + '"PhaseName":"' + currentPhase.phaseName + '"';
                jsonData = jsonData + ',"ProcessName":"' + currentPhase.processName + '"';
                jsonData = jsonData + ',"JobId":"' + currentPhase.jobId + '"';
                jsonData = jsonData + ',"ContactEmail":"' + currentPhase.contactEmail + '"';
                jsonData = jsonData + ',"Tool":"' + currentPhase.tool + '"';
                jsonData = jsonData + ',"ToolId":"' + currentPhase.toolId + '"';
                jsonData = jsonData + ',"Notes":[';
                if (currentPhase.phaseNotes.length > 0) {
                    for (var j = 0; j < currentPhase.phaseNotes.length; j++) {
                        jsonData = jsonData + '{';
                        jsonData = jsonData + '"Annotates":"' + currentPhase.phaseNotes[j].annotates + '"';
                        jsonData = jsonData + ',"NoteFrom":"' + currentPhase.phaseNotes[j].from + '"';
                        jsonData = jsonData + ',"Note":"' + currentPhase.phaseNotes[j].value + '"';
                        if (j != (currentPhase.phaseNotes.length - 1))
                            jsonData = jsonData + '},';
                        else
                            jsonData = jsonData + '}';
                    }
                    jsonData = jsonData + ']';
                }
                else {
                    jsonData = jsonData + ']';
                }

                jsonData = jsonData + '},';
                jsonData = jsonData + '"phaseCounts":[';

                if (listOfPhaseCounts.length > 0) {
                    for (var j = 0; j < listOfPhaseCounts.length; j++) {
                        jsonData = jsonData + '{';
                        jsonData = jsonData + '"PhaseName":"not set"';
                        jsonData = jsonData + ',"CountType":"' + listOfPhaseCounts[j].countType + '"';
                        jsonData = jsonData + ',"Unit":"' + listOfPhaseCounts[j].unit + '"';
                        jsonData = jsonData + ',"Value":"' + listOfPhaseCounts[j].value + '"';
                        if (j != (listOfPhaseCounts.length - 1))
                            jsonData = jsonData + '},';
                        else
                            jsonData = jsonData + '}';
                    }
                    jsonData = jsonData + ']';
                }
                else {
                    jsonData = jsonData + ']';
                }
                jsonData = jsonData + '}';
                return jsonData;
            }
            else {
                var jsonData = '{"textId":"' + textId + '","userIdentifier":"' + userId + '",';
                jsonData = jsonData + '"index":' + segmentIndex + ',';
                jsonData = jsonData + '"timeStamp":"' + timeStamp.toUTCString() + '",';
                jsonData = jsonData + '"state":"' + state + '",';
                jsonData = jsonData + '"source":"' + encodeURIComponent(source) + '",';
                jsonData = jsonData + '"target":"' + encodeURIComponent(target) + '",';
                jsonData = jsonData + '"phase":{';
                jsonData = jsonData + '"PhaseName":"' + currentPhase.phaseName + '"';
                jsonData = jsonData + ',"ProcessName":"' + currentPhase.processName + '"';
                jsonData = jsonData + ',"Date":"' + currentPhase.date.toUTCString() + '"';
                jsonData = jsonData + ',"JobId":"' + currentPhase.jobId + '"';
                jsonData = jsonData + ',"ContactEmail":"' + currentPhase.contactEmail + '"';
                jsonData = jsonData + ',"Tool":"' + currentPhase.tool + '"';
                jsonData = jsonData + ',"ToolId":"' + currentPhase.toolId + '"';
                jsonData = jsonData + ',"Notes":[';
                if (currentPhase.phaseNotes.length > 0) {
                    for (var j = 0; j < currentPhase.phaseNotes.length; j++) {
                        jsonData = jsonData + '{';
                        jsonData = jsonData + '"Annotates":"' + currentPhase.phaseNotes[j].annotates + '"';
                        jsonData = jsonData + ',"NoteFrom":"' + currentPhase.phaseNotes[j].from + '"';
                        jsonData = jsonData + ',"Note":"' + encodeURIComponent(currentPhase.phaseNotes[j].value) + '"';
                        if (j != (currentPhase.phaseNotes.length - 1))
                            jsonData = jsonData + '},';
                        else
                            jsonData = jsonData + '}';
                    }
                    jsonData = jsonData + ']';
                }
                else {
                    jsonData = jsonData + ']';
                }
                jsonData = jsonData + '},';
                jsonData = jsonData + '"phaseCounts":[';
                if (listOfPhaseCounts.length > 0) {
                    for (var j = 0; j < listOfPhaseCounts.length; j++) {

                        jsonData = jsonData + '{';
                        jsonData = jsonData + '"PhaseName":"not set"';
                        jsonData = jsonData + ',"CountType":"' + listOfPhaseCounts[j].countType + '"';
                        jsonData = jsonData + ',"Unit":"' + listOfPhaseCounts[j].unit + '"';
                        jsonData = jsonData + ',"Value":"' + listOfPhaseCounts[j].value + '"';

                        if (j != (listOfPhaseCounts.length - 1))
                            jsonData = jsonData + '},';
                        else
                            jsonData = jsonData + '}';
                    }

                    jsonData = jsonData + ']';
                }
                else {
                    jsonData = jsonData + ']';
                }

                jsonData = jsonData + '}';

                return jsonData;
            }
        }

        //returns a string representing a revision phase format("t1.1" means thinking phase number one in the first text segment).
        function buildPhaseNameString(segmentIndex, revisionNumber) {
            return "r" + segmentIndex.toString() + "." + revisionNumber.toString();
        }

        //builds expected metrics(check documentation for more detais) from the collected metadata(action performed every time a revision is submitted).
        function buildCountsList(phase) {

            var countsList = [];

            if (phase.numberOfKeysPressed > 0)
                countsList.push(new Count("N.A.", "x-keys", "instance", phase.numberOfKeysPressed));

            if (phase.numberOfDeleteKeysPressed > 0)
                countsList.push(new Count("N.A.", "x-delete-keys", "instance", phase.numberOfDeleteKeysPressed));

            if (phase.numberOfWhiteKeysPressed > 0)
                countsList.push(new Count("N.A.", "x-white-keys", "instance", phase.numberOfWhiteKeysPressed));

            if (phase.numberOfNonWhiteKeysPressed > 0)
                countsList.push(new Count("N.A.", "x-nonwhite-keys", "instance", phase.numberOfNonWhiteKeysPressed));

            if (phase.numberOfArrowKeysPressed > 0)
                countsList.push(new Count("N.A.", "x-arrow-keys", "instance", phase.numberOfArrowKeysPressed));

            if (phase.phaseStartTime != null && phase.phaseEndTime != null) {
                var difference = (phase.phaseEndTime - phase.phaseStartTime) / 1000;
                phase.phaseName.indexOf("r") > -1 ? countsList.push(new Count("N.A.", "x-editing-time", "x-seconds", difference)) : countsList.push(new Count("N.A.", "x-think-time", "x-seconds", difference));

            }

            if (phase.numberOfTranslationOptionsUsed > 0)
                countsList.push(new Count("N.A.", "x-trans-options-usage", "instance", phase.numberOfTranslationOptionsUsed));

            if (phase.numberOfInteractiveChecks > 0)
                countsList.push(new Count("N.A.", "x-checking-usage", "instance", phase.numberOfInteractiveChecks));

            if (phase.numberOfParaphrasingChecks > 0)
                countsList.push(new Count("N.A.", "x-paraphrasing-usage", "instance", phase.numberOfParaphrasingChecks));

            if (phase.numberOfParaphrasingFailedChecks > 0)
                countsList.push(new Count("N.A.", "x-paraphrasing-failures", "instance", phase.numberOfParaphrasingFailedChecks));


            if (phase.switchTimeStampList.length > 1) {
                countsList.push(new Count("N.A.", "x-start_source_switch", "instance", phase.startSwitch));
                countsList.push(new Count("N.A.", "x-source_switch", "instance", (phase.switchTimeStampList.length - 1)));

                for (var i = 1; i < phase.switchTimeStampList.length; i++) {
                    var difference = (phase.switchTimeStampList[i] - phase.switchTimeStampList[i - 1]) / 1000;
                    countsList.push(new Count("N.A.", "x-source_switch", "x-seconds", difference));
                }
            }

            //new metric for time frame, this one for when the user actually started typing some text.
            if (phase.startTyping != null && phase.phaseEndTime != null) {
                var difference = (phase.phaseEndTime - phase.startTyping) / 1000;
                countsList.push(new Count("N.A.", "x-typing-time", "x-seconds", difference));
            }

            return countsList;
        }


        //core objects:

        //object representative of actions performed over a segment(it is created one of these for each segment the content/text has, meaning that, during the editon period it will keep track on all actions performed in a segment).
        function TranslationUnit(index, state, phaseName, source, target, lastComment, lastOption) {
            this.index = index;
            this.state = state;
            this.phaseName = phaseName;
            this.source = source;
            this.target = target;
            this.translationUnitPhases = [];
            this.translationUnitPhasesCount = 0;
            //keep track on last comments to understand if when the user revisits a paragraph the prior comment did not change. 
            this.lastComment = lastComment;
            this.lastOption = lastOption;
            //think phase array.
            this.thinkPhases = [];
            this.translationUnitThinkPhasesCount = 0;
            //for the purposes of persisting comments and DDL pre set comments options. 
            this.currentLastComment = "";
            this.currentLastOption = "";
        }

        //object for comments and translation options replacement are saved as a notes(please consult documentation on the XLIFF report).
        function Note(annotates, from, value) {
            this.annotates = annotates;
            this.from = from;
            this.value = value;
        }

        //object representative of either thinking or edition phase. 
        function Phase(phaseName, processName, date, jobId, contactEmail, tool, toolId) {
            this.phaseName = phaseName;
            this.processName = processName;
            this.date = date;
            this.jobId = jobId;
            this.contactEmail = contactEmail;
            this.tool = tool;
            this.toolId = toolId;
            this.alreadySent = false;
            this.phaseNotes = [];
            //x-editing-time.
            this.phaseStartTime = new Date();
            this.phaseEndTime = null;
            //x-assessing-time. 
            //x-keys.
            this.numberOfKeysPressed = 0;
            //x-white-keys.
            this.numberOfWhiteKeysPressed = 0;
            //x-nonwhite-keys.
            this.numberOfNonWhiteKeysPressed = 0;
            //x-arrow-keys (↑,↓,→,←, End, Home ).
            this.numberOfArrowKeysPressed = 0;
            //x-delete-keys (delete or backspace).
            this.numberOfDeleteKeysPressed = 0;
            //x-other-keys.
            this.numberOfOtherKeysPressed = 0;
            //x-deletion.        
            //1) user marks something with the mouse, then starts to type, presses the delete or backspace key or CTRL+X.
            //2) user presses delete key repeatedly.
            //3) user presses backspace key repeatedly.
            //4) user presses combination of backspace and delete key.          
            this.numberOfDeletions = 0;
            //x-insertion
            //user types combination of alphanumeric keys or uses CTRL+V.
            //-> break between two keys should not be longer than 1 second (TBC).
            //-> once they use the arrow keys or click somewhere else with the mouse, the insertion ends.                    
            this.numberOfInsertions = 0;
            //x-trans-options-usage.
            this.numberOfTranslationOptionsUsed = 0;

            //x-checking-usage. OR //x-interactive-checking-usage.
            this.numberOfInteractiveChecks = 0;

            //x-paraphrasing-usage. 
            this.numberOfParaphrasingChecks = 0;

            //x-paraphrasing-failures. 
            this.numberOfParaphrasingFailedChecks = 0;

            //start-switch.   
            this.startSwitch = $.processName == "bilingual" ? "show" : "hide";
            this.switchTimeStampList = [new Date()];
            //new metric for the time-frame where user actually started typing text.
            this.startTyping = null;

        }

        //object used to help on counting generic metrics.
        function Count(countPhaseName, countType, unit, value) {
            this.countPhaseName = countPhaseName;
            this.countType = countType;
            this.unit = unit;
            this.value = value;
        }

        //adds a new note within the ongoing phase(can be thinking or edition phase)
        function addNewCheckRelatedNote(annotatesTarget, from, what) {
            //<note annotates="target" from="trans_options">question|||problème|||7</note>
            //the pool index starts from zero and the global position start from one.
            var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);
            //means the user is on a new segment, so a new Phase object needs to be created.
            if (!isNewPhaseCreatedForThisRevision) {
                //saving any pending think phases.
                saveThinkPhase(translationUnitsPool[currentTranslationUnitArrayIndex]);
                var newPhase = new Phase(buildPhaseNameString(globalCurrentTranslationUnitIndex, (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount + 1)), $.processName, new Date(), $.jobId, $.currentUserId, $.tool, $.tooldId);
                translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.push(newPhase);
                ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhasesCount;
                isNewPhaseCreatedForThisRevision = true;
            }
            var currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);                
            var newNote = new Note(annotatesTarget, from, what);
            translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].phaseNotes.push(newNote);                       
        }

        //same functionality than 'addNewCheckRelatedNote' but for think phases.
        function addNewThinkPhaseCheckRelatedNote(annotatesTarget, from, what) {
            //<note annotates="target" from="trans_options">question|||problème|||7</note>
            //the pool index starts from zero and the global position start from one.
            var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);
            var currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases.length - 1);
            var newNote = new Note(annotatesTarget, from, what);
            translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].phaseNotes.push(newNote);           
        }

        //paraphrasing:

        //init paraphrasing
        function initPostEditParaphrasing(systemId) {
            if ($(document).find('#targetTextArea__ifr').length) {
                initParaphrasingService(); doWork();
            }
            else {
                var checkExistMain = setInterval(function () {
                    if ($(document).find('#targetTextArea__ifr').length) {
                        initParaphrasingService();
                        doWork();
                        clearInterval(checkExistMain);
                    }
                }, 100);
            }
        }
     
        function setSelectionRange(el, start, end) {
            if (document.createRange && window.getSelection) {
                var range = document.createRange();
                range.selectNodeContents(el);
                var textNodes = getTextNodesIn(el);
                var foundStart = false;
                var charCount = 0, endCharCount;

                for (var i = 0, textNode; textNode = textNodes[i++];) {
                    endCharCount = charCount + textNode.length;
                    if (!foundStart && start >= charCount
                            && (start < endCharCount ||
                            (start == endCharCount && i < textNodes.length))) {
                        range.setStart(textNode, start - charCount);
                        foundStart = true;
                    }
                    if (foundStart && end <= endCharCount) {
                        range.setEnd(textNode, end - charCount);
                        break;
                    }
                    charCount = endCharCount;
                }

                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.selection && document.body.createTextRange) {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(true);
                textRange.moveEnd("character", end);
                textRange.moveStart("character", start);
                textRange.select();
            }
        }

        function getTextNodesIn(node) {
            var textNodes = [];
            if (node.nodeType == 3) {
                textNodes.push(node);
            } else {
                var children = node.childNodes;
                for (var i = 0, len = children.length; i < len; ++i) {
                    textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
                }
            }
            return textNodes;
        }

        //gets the caret current position within the editor.
        function getCaretPosition() {
            var startIndex = undefined;
            var iframe = document.getElementById('targetTextArea__ifr');
            if (typeof iframe.contentWindow.getSelection != "undefined") {
                var sel = iframe.contentWindow.getSelection();
                startIndex = sel.baseOffset;
                startIndex === undefined ? startIndex = sel.anchorOffset : startIndex = sel.baseOffset;
                if (sel.rangeCount) {
                    var container = document.createElement("div");
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        container.appendChild(sel.getRangeAt(i).cloneContents());
                    }
                }
            } else if (typeof iframe.contentDocument.selection != "undefined") {
                if (iframe.contentDocument.selection.type == "Text") {
                    startIndex = iframe.contentDocument.selection.baseOffset;
                    if (startIndex === undefined) {
                        var element = iframe.contentDocument.getElementsByTagName('body')[0];
                        var range = iframe.contentDocument.selection.createRange();
                        var stored_range = range.duplicate();
                        stored_range.moveToElementText(element);
                        stored_range.setEndPoint('EndToEnd', range);
                        startIndex = element.selectionStart = stored_range.text.length - range.text.length;
                        element.selectionEnd = element.selectionStart + range.text.length;
                    }
                }
            }
            return startIndex;
        }

        //clean paraphrasing data.
        function cleanParaphrasing(resetTextNodes) {
            $("ul.acm-default").remove();          
            if ($paraContainer.find(".paraphrasing-highlight").length > 0) {
                $('#targetTextArea_').val($('#targetTextArea_').html().replace('<span id="myID" class="paraphrasing-highlight">', "").replace("</span>", ""));             
            }
        }

        //remove node keeping is children.
        function removeKeepChildren(node) {
            var $node = $(node);
            $node.contents().each(function () {
                $(this).insertBefore($node);
            });
            $node.remove();
        }

        //refreshing container position.
        function refreshParaphrasingIframePosition() {
            if ($paraiframe == null)
                $paraiframe = $(document).find('#targetTextArea__ifr');
            $.paraifrx = 0;
            $.paraifry = 0;
            $.paraifrx = $paraiframe.offset().left - $paraiframe.contents().find('body').scrollLeft();
            $.paraifry = $paraiframe.offset().top - $paraiframe.contents().find('body').scrollTop();
            $.paraifry -= $(window).scrollTop();
            $.paraifrx -= $(window).scrollLeft();
        
        }

        //adding splitted node.
        function addSplittedNode(node, startPos, endPos, elementtype, classname, id) {
            var spannode = document.createElement(elementtype);
            spannode.className = classname;
            spannode.id = id;            
            var middlebit = node.splitText(startPos);
            var endbit = middlebit.splitText(endPos);
            var middleclone = middlebit.cloneNode(true);
            spannode.appendChild(middleclone);
            middlebit.parentNode.replaceChild(spannode, middlebit);

        }

        //creates a paraphrasing context-menu.
        function createContextMenu(menuname, startIndex) {
            $paraContainer.find('SPAN.paraphrasing-highlight').each(function (index) {
                if (!$(this).data('events')) {
                    $(this).acceptParaphrasingContextMenu(menuname,
							{
							    event: 'mouseover',
							    onSelect: function (e, context) {
							        //getting current segment index.
							        var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);
							        //getting index for last think phase on the current segment.
							        var currentPhaseArrayIndex = -1;
							        if ($(this).attr("id").toString() != "liDismiss") {
							            var index = startIndex;
							            var optionSelectedIndex = parseInt($(this).attr("id").split("_")[1]);
							            ++optionSelectedIndex;
							            var usageTimeStamp = getISODate();
							            addNewCheckRelatedNote("target", "paraphrasing_replacement", paraphrasingSelectionTimestamp + "|||" + $(context).text() + "|||" + $(this).text() + "|||" + index + "|||" + optionSelectedIndex + "|||" + usageTimeStamp + "|||" + $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">"));
							            currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
							            ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfParaphrasingChecks;							           
							            $(context).text($(this).text());
							            cleanParaphrasing();
							          					         
							        } else {
							            if (!isNewPhaseCreatedForThisRevision) {
							                currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases.length - 1);
							                addNewThinkPhaseCheckRelatedNote("target", "paraphrasing_display", paraphrasingSelectionTimestamp + "|||" + $(context).text() + "|||" + startIndex + "|||" + $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">"));
							                ++translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].numberOfParaphrasingChecks;
							            }
							            else {
							                addNewCheckRelatedNote("target", "paraphrasing_display", paraphrasingSelectionTimestamp + "|||" + $(context).text() + "|||" + startIndex + "|||" + $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">"));
							                currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
							                ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfParaphrasingChecks;

							            }
							            cleanParaphrasing();
							        }
							    },
							    beforeDisplay: function (e, context, id) {							     
							        //since we want the difference between the period the user saw the context menu and the replacement took place.
							        paraphrasingSelectionTimestamp = getISODate();
							        refreshParaphrasingIframePosition();
							    }
							});
                }
            });
        }

        //creates a paraphrasing (no results)context-menu.
        function createEmptyContextMenu(menuname, onSelectCustom) {

            $paraContainer.find('SPAN.paraphrasing-highlight').each(function (index) {

                if (!$(this).data('events')) {
                    $(this).acceptParaphrasingContextMenu(menuname,
							{
							    event: 'mouseover',
							    onSelect: function (e, context) {

							        if (onSelectCustom)
							            onSelectCustom();
							    },
							    beforeDisplay: function (e, context, id) {
							        refreshParaphrasingIframePosition();
							    }
							});
                }
            });
        }

        //init paraphrasing(caches: container, iframe, iframe header).
        function initParaphrasingService() {
            //signal r connection setup.           
            $.connection.hub.url = settings.acceptHubUrl;
            postEditHub = $.connection.postEdit;
            $.extend(postEditHub.client, {
                handleSync: function (dataSync) {

                    if (typeof console == "object")
                        console.log(dataSync);
                }
            });
            $.connection.hub.start().done(function () {
                postEditHub.server.paraphrasingSync();
            });



            //cache target iframe for paraphrasing fast access.
            $paraContainer = $(document).find('#targetTextArea__ifr').contents().find("#tinymce");
            $paraiframe = $(document).find('#targetTextArea__ifr');
            //access the iframe header to inject the accept styles.
            var $parahead = $paraiframe.contents().find("head");
            $parahead.append($("<link/>", { rel: "stylesheet", href: settings.cssPath + "/AcceptRealTime.css", type: "text/css" }));//accept-contextmenu.css
            $parahead.append('<meta http-Equiv="Cache-Control" Content="no-cache">');
            $parahead.append('<meta http-Equiv="Pragma" Content="no-cache">');
            $parahead.append('<meta http-Equiv="Expires" Content="0">');
        }

        //var currentParaphrasingContainer = null;
        //kicks de paraphrasing. 
        function doWork() {       
            $("#targetTextArea__ifr").contents().find("#tinymce").bind("mouseup", function (e) {
                if ($paraContainer != null && isInteractiveCheckEnabled == false && $paraContainer.find(".paraphrasing-highlight").length == 0) {              
                    getSelectionHtml(e);
                }
            });
        }

        //gets mouse selection.
        function getSelectionHtml(e) {
            var html = "";
            var startIndex = undefined;
            var iframe = document.getElementById('targetTextArea__ifr');
            if (typeof iframe.contentWindow.getSelection != "undefined") {
                var sel = iframe.contentWindow.getSelection();
                startIndex = sel.baseOffset;
                startIndex === undefined ? startIndex = sel.anchorOffset : startIndex = sel.baseOffset;
                if (sel.rangeCount) {
                    var container = document.createElement("div");
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        container.appendChild(sel.getRangeAt(i).cloneContents());
                    }
                    html = container.innerHTML;
                }
            } else if (typeof iframe.contentDocument.selection != "undefined") {
                if (iframe.contentDocument.selection.type == "Text") {
                    html = iframe.contentDocument.selection.createRange().htmlText;
                    startIndex = iframe.contentDocument.selection.baseOffset;
                    if (startIndex === undefined) {
                        //the current selection.
                        var element = iframe.contentDocument.getElementsByTagName('body')[0];
                        var range = iframe.contentDocument.selection.createRange();
                        //we will use this as a dummy.
                        var stored_range = range.duplicate();
                        //select all text.
                        stored_range.moveToElementText(element);
                        //now move dummy end point to end point of original range.
                        stored_range.setEndPoint('EndToEnd', range);
                        //now we can calculate start and end points.
                        startIndex = element.selectionStart = stored_range.text.length - range.text.length;
                        element.selectionEnd = element.selectionStart + range.text.length;
                    }
                }
            }

            //TODO:caret position.
            cleanParaphrasing();
         
            if ($.trim(html).length > 0 && startIndex !== undefined) {           
                $paraContainer.highlightParaphrasing(html, startIndex, "span", "paraphrasing-highlight", "myID");
                prepParaprhasing(html, $(e.target).text(), startIndex);
                paraphrasingSelection = "";
                paraphrasingSelection = html;           
            }
           
        }

        //prepares the selected content to be processed by the back-end system.
        function prepParaprhasing(context, target, startIndex) {
            var pb, pa;
            pb = pa = target;
            var targettwo = pb.slice(0, startIndex);
            var targetthree = pa.slice(parseInt(startIndex + context.length), target.length);           
            target = replaceAll(encodeURIComponent(targettwo + "+||+" + context + "+||+" + targetthree), "%20", "%2B");          
            getParaphrasingResults(maxResults, paraSystemId, paraphrasingLanguage, target, startIndex);
        }

        //performs ajax call to the back-end system.
        function getParaphrasingResults(maxR, sysId, lang, target, startIndex) {
            //building awaiting menu.
            var menuName = parseInt($(".acm-default").length) + 1;
            $(document.body).append('<ul id="paraMenu_' + menuName + '" class="acm-default" style="z-index: 9999999;display:none;">');
            $('#paraMenu_' + menuName).append('<li style="cursor:pointer;"  class="icon">'
                 + '<span class="icon " title=""><img id="imgParaphrasingCheckLoading_" alt="" src="' + settings.imagesPath + '/ajax-loader-interactive-check.gif" /></span>' + $.messageLoadingParaphrasingResults + '</li>');

            createEmptyContextMenu('paraMenu_' + menuName, function () { });


            if (!postEditHub.handleParaphrasingResponse) {
                $.extend(postEditHub.client, {
                    handleParaphrasingResponse: function (connectionId, responseStatus, data, exception) {
                        paraphrasingSelectionTimestamp = getISODate();                        
                        $paraContainer.find('SPAN.paraphrasing-highlight').unbind();
                        if (responseStatus == "OK")
                            handleParaphrasingServiceResponse(data, 'paraMenu_' + menuName, startIndex);
                        else {
                            //getting current segment index.
                            var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);
                            //getting index for last think phase on the current segment.
                            var currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases.length - 1);                           
                            //increase paraphrasing check.
                            if (!isNewPhaseCreatedForThisRevision) {
                                ++translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].numberOfParaphrasingFailedChecks;
                                ++translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].numberOfParaphrasingChecks;
                                addNewThinkPhaseCheckRelatedNote("target", "paraphrasing_failure", paraphrasingSelectionTimestamp + "|||" + paraphrasingSelection + "|||" + startIndex + "|||" + $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">"));
                            }
                            else {
                                //updating the current phase index for non thinking phases.
                                currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
                                ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfParaphrasingFailedChecks;
                                ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfParaphrasingChecks;
                                addNewCheckRelatedNote("target", "paraphrasing_failure", paraphrasingSelectionTimestamp + "|||" + paraphrasingSelection + "|||" + startIndex + "|||" + $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">"));
                            }

                            setTimeout(function () {
                                $('#paraMenu_' + menuName).empty().unbind();
                               
                                if (responseStatus.indexOf("FAILED:The operation has timed out") != -1)
                                    $.messageParaprasingServiceFailed = $.messageNoParaphrasingResults;
								
                                $('#paraMenu_' + menuName).append('<li style="cursor:pointer;" id="liInfoOption" class="icon">'
                                     + '<span class="icon ignore" title=""></span>' + $.messageParaprasingServiceFailed + '</li>'
                                     + '<li id="liDismiss" style="cursor:pointer;" class="icon"><span class="icon erase" title=""></span>' + $.dismissLabel + '</li>');

                                createEmptyContextMenu('paraMenu_' + menuName, function () {
                                    cleanParaphrasing();                                   
                                });

                            }, 200);
                        }
                    }
                });
            }
            $.connection.hub.stop();
            $.connection.hub.start().done(function () {
                postEditHub.server.paraphrasing(maxR.toString(), sysId, lang, "", target, "");
            });
        }

        //helper method to perform string replacements using regex.
        function escapeRegExp(string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }

        //helper method to perform string replacements using regex.
        function replaceAll(string, find, replace) {
            return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
        }

        //responsible for parsing de json response and to create the context-menus on the fly.
        function handleParaphrasingServiceResponse(data, awaitMenuName, startIndex) {
            try {              
                $("#" + awaitMenuName).empty().unbind();
                //create the paraphrasing menu on the fly.               
                var jsonObj = data;
                if (jsonObj.resultSet.length > 0) {
                    for (var i = 0; i < jsonObj.resultSet.length; i++) {
                        var pr = jsonObj.resultSet[i][0].toString();                     
                        $("#" + awaitMenuName).append('<li style="cursor:pointer;" id="sug_' + i.toString() + '" class="icon">'
                        + '<span class="icon spelling" title="">'
                        + '</span>' + pr + '</li>');                   
                    }
                    $("#" + awaitMenuName).append('<li id="liDismiss" style="cursor:pointer;" class="icon"><span class="icon erase" title=""></span>' + $.dismissLabel + '</li>');                    
                    createContextMenu(awaitMenuName, startIndex);
                }
                else {
                    
                    //getting current segment index.
                    var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);
                    //getting index for last think phase on the current segment.
                    var currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases.length - 1);

                    //increase paraphrasing check.
                    if (!isNewPhaseCreatedForThisRevision) {
                        addNewThinkPhaseCheckRelatedNote("target", "paraphrasing_empty", paraphrasingSelectionTimestamp + "|||" + paraphrasingSelection + "|||" + startIndex + "|||" + $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">"));
                        ++translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].numberOfParaphrasingChecks;
                    }
                    else {
                        //updating the current phase index for non thinking phases.
                        currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
                        addNewCheckRelatedNote("target", "paraphrasing_empty", paraphrasingSelectionTimestamp + "|||" + paraphrasingSelection + "|||" + startIndex + "|||" + $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">"));
                        ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfParaphrasingChecks;
                    }
                  
                    $("#" + awaitMenuName).append('<li id="liInfoOption" style="cursor:pointer;"  class="icon">'
                    + '<span class="icon ignore" title=""></span>' + $.messageNoParaphrasingResults + '</li>'
                    + '<li id="liDismiss" style="cursor:pointer;" class="icon"><span class="icon erase" title=""></span>' + $.dismissLabel + '</li>');
                 
                    createEmptyContextMenu(awaitMenuName, function () {
                        cleanParaphrasing();                      
                    });
                }

            } catch (e) { }
        }


        //init interactive check.
        function initInteractiveCheck() {           
            if (isParaphrasingEnabled || $.displayTranslationOptions) {
                $('div[aria-labelledby=ui-dialog-title-' + "postEditDialog_" + ']').find('#switchParaphrasingButton_').unbind();
                if (isParaphrasingEnabled) {
                    $('div[aria-labelledby=ui-dialog-title-' + "postEditDialog_" + ']').find('#switchParaphrasingButton_').toggle(function () {
                        $(this).removeClass('onparaprasing').html(labelInteractiveCheck);
                        isParaphrasingEnabled = true;
                        isInteractiveCheckEnabled = false;
                        //reset text nodes in one single text node(improves mouse selection).                        
                        $('#targetTextArea_').text($('#spanParagraph_' + globalCurrentTranslationUnitIndex + '').text());
                        $("#postEditDialog_").css("opacity", "1");
                        $("#imgInteractiveCheckLoading_").css("display", "none");
                        //reset rendered attr(used to avoid displaying markup on already rendered segments).
                        $("editedContent_").find('id^="spanParagraph_"').removeAttr("data-accept-isrendered");
                        try {
                            //clean all interactive check data.
                            $.clearPreEditRealtimeCheckData(true);
                            //since this guy is not part of the interactive check plugin initial configuration, we need to clean it using other method.
                            $.clearContainerData($("#targetTextArea__ifr").contents().find("#tinymce"));
                        } catch (e) { }
                        //enable undo/redo                        
                        $("#postEditDialog_").find('div[aria-label="Redo"]').show();
                        $("#postEditDialog_").find('div[aria-label="Undo"]').show();

                    }, function () {

                        if (interactiveCheckRuleSet.length > 0) {
                            var pos = $('div[aria-labelledby=ui-dialog-title-' + "postEditDialog_" + ']').find('.ui-dialog-buttonpane .ui-dialog-buttonset').find("div.slider-frame-paraprasing").position();
                            $("#imgInteractiveCheckLoading_").css({
                                position: "absolute",
                                top: (pos.top + 10) + "px",
                                left: (pos.left - 2.5) + "px"
                            }).show();                           
                            //changing opacity.
                            $("#postEditDialog_").css("opacity", "0.2");
                            $(this).addClass('onparaprasing').html(labelParaphrasingService);
                            //updating left side with latest edition state.
                            var textSegment = $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">");
                            if (textSegment.length == 0)
                                textSegment = $.labelEmptySegment;
                            $('#editedContent_ DIV.postedit-highlight').text(textSegment);

                            isParaphrasingEnabled = false;
                            isInteractiveCheckEnabled = true;
                            cleanParaphrasing();
                            //will trigger interactive check.
                            $("#spanPostEditRealtimeCheckTargetText_").trigger("click");
                            //disable undo/redo                        
                            $("#postEditDialog_").find('div[aria-label="Redo"]').hide();
                            $("#postEditDialog_").find('div[aria-label="Undo"]').hide();
                        } else {                           
                            displayToolbarMessage('<span style="color:red;display:inline;vertical-align: middle;text-align: center;"><b>' + $.messageInteractiveCheckNotAvailable + '</b></span>');
                            $("#switchParaphrasingButton_").trigger("click");
                        }
                    });
                }
                else {
                    $('div[aria-labelledby=ui-dialog-title-' + "postEditDialog_" + ']').find('#switchParaphrasingButton_').toggle(function () {
                        //update switch button label.
                        $(this).removeClass('onparaprasing').html(labelInteractiveCheck);
                        //note: translation options dont have an enable/disable flag.
                        $("#postEditDialog_").css("opacity", "1");
                        isInteractiveCheckEnabled = false;
                        //hide interactive check loading. 
                        $("#imgInteractiveCheckLoading_").css("display", "none");
                        //reset rendered attr(used to avoid displaying markup on already rendered segments).
                        $("editedContent_").find('id^="spanParagraph_"').removeAttr("data-accept-isrendered");
                        try {
                            //clean all interactive check data.
                            $.clearPreEditRealtimeCheckData(true);
                            //since this guy is not part of the interactive check plugin initial configuration, we need to clean it using other method.
                            $.clearContainerData($("#targetTextArea__ifr").contents().find("#tinymce"));
                        } catch (e) { }
                        //enable undo/redo.                        
                        $("#postEditDialog_").find('div[aria-label="Redo"]').show();
                        $("#postEditDialog_").find('div[aria-label="Undo"]').show();

                    }, function () {
                        if (interactiveCheckRuleSet.length > 0) {
                            var pos = $('div[aria-labelledby=ui-dialog-title-' + "postEditDialog_" + ']').find('.ui-dialog-buttonpane .ui-dialog-buttonset').find("div.slider-frame-paraprasing").position();
                            $("#imgInteractiveCheckLoading_").css({
                                position: "absolute",
                                top: (pos.top + 10) + "px",
                                left: (pos.left - 2.5) + "px"
                            }).show();                          
                            //changing opacity.
                            $("#postEditDialog_").css("opacity", "0.2");
                            //updating left side with latest edition state.
                            var textSegment = $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">");
                            if (textSegment.length == 0)
                                textSegment = $.labelEmptySegment;
                            $('#editedContent_ DIV.postedit-highlight').text(textSegment);
                            //note: translation options dont have an enable/disable flag.
                            isInteractiveCheckEnabled = true;
                            //TODO: clean translation options markup.

                            $("#spanPostEditRealtimeCheckTargetText_").trigger("click");
                            $(this).addClass('onparaprasing').html(labelTranslationOptions);
                            //disable undo/redo.                        
                            $("#postEditDialog_").find('div[aria-label="Redo"]').hide()
                            $("#postEditDialog_").find('div[aria-label="Undo"]').hide();
                        } else {
                            
                            displayToolbarMessage('<span style="color:red;display:inline;vertical-align: middle;text-align: center;"><b>' + $.messageInteractiveCheckNotAvailable + '</b></span>');
                            $("#switchParaphrasingButton_").trigger("click");
                        }
                    });
                }

                //inits the main bottom slider.
                $('div[aria-labelledby=ui-dialog-title-' + "postEditDialog_" + ']').find('#switchParaphrasingButton_').trigger('click');

                //kicks the interactive check.
                initTargetAreaInteractiveCheck();
            } else { $(".slider-frame-paraprasing").css("display", "none"); }
        }

        //init new interactive check instance.
        function initInteractiveCheckInstance() {
            $iframe = $('#targetTextArea__ifr');
            $head = $iframe.contents().find("head");
            $head.append($("<link/>", { rel: "stylesheet", href: settings.cssPath + "/AcceptRealTime.css", type: "text/css" }));
            $head.append('<meta http-Equiv="Cache-Control" Content="no-cache">');
            $head.append('<meta http-Equiv="Pragma" Content="no-cache">');
            $head.append('<meta http-Equiv="Expires" Content="0">');
            //gather elements for interactive check.          
            var $allContainers = $("#editedContent_").find('div[id^="spanParagraph_"]');

            $allContainers.AcceptRealTime({                             
                configurationFilesPath: settings.interactiveCheckConfigPath,
                acceptHubUrl: settings.acceptHubUrl,
                cssSelectorToolbarMessage: '.mce-path',                
                Lang: interactiveCheckLanguage,
                uiLanguage: interactiveCheckLanguage,
                Rule: interactiveCheckRuleSet,
                onAfterCheck: function () {
                    if (isInteractiveCheckEnabled) {
                        $("#imgInteractiveCheckLoading_").css("display", "none"); $("#postEditDialog_").css("opacity", "1");
                        $.renderStandaloneResult((globalCurrentTranslationUnitIndex - 1), $("#targetTextArea__ifr").contents().find("#tinymce"));
                        $("#spanParagraph_" + globalCurrentTranslationUnitIndex).attr("data-accept-isrendered", "1");                      
                        if ($("#editedContent_").find('span.[class^="accept-highlight"]').length == 0 && $iframe.contents().find('body').find('span.[class^="accept-highlight"]').length == 0)
                            displayToolbarMessage('<span style="color:#0e9e4c;display:inline;vertical-align: middle;text-align: center;"><b>' + $.messageInteractiveCheckNoResults + '</b></span>');
                    }
                },
                onBeforeCheck: function () {

                    //cleaning any markup already udnertaken within the target editor.
                    var newTartgetTextToDisplay = $('#editedContent_').find('DIV.postedit-highlight').text();
                    $('#targetTextArea_').val(newTartgetTextToDisplay.replace("<", "&lt;").replace(">", "&gt;"));

                    //getting current segment index.
                    var currentTranslationUnitArrayIndex = (globalCurrentTranslationUnitIndex - 1);
                    //getting index for last think phase on the current segment.
                    var currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases.length - 1);

                    //increase interactive check.
                    if (!isNewPhaseCreatedForThisRevision) {
                        ++translationUnitsPool[currentTranslationUnitArrayIndex].thinkPhases[currentPhaseArrayIndex].numberOfInteractiveChecks;
                    }
                    else {
                        //updating the current phase index for non thinking phases.
                        currentPhaseArrayIndex = (translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases.length - 1);
                        ++translationUnitsPool[currentTranslationUnitArrayIndex].translationUnitPhases[currentPhaseArrayIndex].numberOfInteractiveChecks;
                    }
                },
                onReplace: function (e, context, option) {
                    var index = $(context).attr("id").split("_")[1];
                    var optionSelectedIndex = parseInt($(option).attr("id").split("_")[2]);
                    ++optionSelectedIndex;
                    var usageTimeStamp = getISODate();
                    addNewCheckRelatedNote("target", "interactive_check", interactiveCheckMenuDisplayTimeStamp + "|||" + $(context).text() + "|||" + $(option).text() + "|||" + index + "|||" + optionSelectedIndex + "|||" + usageTimeStamp + "|||" + $('#targetTextArea_').text().replace("&lt;", "<").replace("&gt;", ">"));
                    interactiveCheckMenuDisplayTimeStamp = null;
                },
                onBeforeDisplayingContextMenus: function (e, context, option) {                
                    interactiveCheckMenuDisplayTimeStamp = getISODate();
                },
                requestFormat: "HTML",
                realTimeCheckSelector: "#spanPostEditRealtimeCheckTargetText_",
                iframePlaceholder: $iframe
            });


        }

        //init the interactive check that will handle the target text area.
        function initTargetAreaInteractiveCheck() {
            //check if container is loaded and accessible.
            if ($('#targetTextArea__ifr').contents().find('#tinymce').length > 0) {
                initInteractiveCheckInstance();
            }
            else {
                var checkExistTargetIframe = setInterval(function () {
                    initInteractiveCheck();
                    clearInterval(checkExistTargetIframe);

                }, 100);
            }

        }

        //get the date under the required ISO format.
        function getISODate() {
            var now = new Date().toISOString();
            //alert(now);
            return now;
        }

        //last action is actually to initialize the all thing(bind events etc...).
        initAcceptPostEdit();

    }//post-edit plug-in   

    $.extend({
        parseJSON: function (data) {
            if (typeof data !== "string" || !data) {
                return null;
            }
            data = jQuery.trim(data);
            if (/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                return window.JSON && window.JSON.parse ?
                        window.JSON.parse(data) :
                        (new Function("return " + data))();

            } else {
                jQuery.error("Invalid JSON: " + data);
            }
        }
    });

})(jQuery); //post-edit plug-in core.

// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/Component",
    "sap/m/MessageToast",
    "sap/ushell/ui/shell/ToolAreaItem",
    "sap/m/Panel",
    "sap/m/VBox",
    "sap/m/Label",
    "sap/m/Switch"
], function (Component, MessageToast, ToolAreaItem, Panel, VBox, Label, Switch) {
    "use strict";

    var sComponentName = "s4d425.flp.plugin##";

    return Component.extend(sComponentName + ".Component", {


        metadata: {
            manifest: "json"
        },


        /**
         * Returns the shell renderer instance in a reliable way,
         * i.e. independent from the initialization time of the plug-in.
         * This means that the current renderer is returned immediately, if it
         * is already created (plug-in is loaded after renderer creation) or it
         * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
         * before the renderer is created).
         *
         *  @returns {object}
         *      a jQuery promise, resolved with the renderer instance, or
         *      rejected with an error message.
         */
        _getRenderer: function () {
            var that = this,
                oDeferred = new jQuery.Deferred(),
                oRenderer;

            that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
            if (!that._oShellContainer) {
                oDeferred.reject("Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
            } else {
                oRenderer = that._oShellContainer.getRenderer();
                if (oRenderer) {
                    oDeferred.resolve(oRenderer);
                } else {
                    // renderer not initialized yet, listen to rendererCreated event
                    that._onRendererCreated = function (oEvent) {
                        oRenderer = oEvent.getParameter("renderer");
                        if (oRenderer) {
                            oDeferred.resolve(oRenderer);
                        } else {
                            oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
                        }
                    };
                    that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
                }
            }
            return oDeferred.promise();
        },

        init: function () {

            this._getRenderer().fail(function (sErrorMessage) {
                jQuery.sap.log.error(sErrorMessage, undefined, sComponentName);
            })
                .done(function (oRenderer) {

                    //Create and display a sub header control with 3 buttons in Fiori launchpad, in the launchpad states "App" and "Home":
                    //"App" - launchpad state when running a Fiori app
                    //"Home" - launchpad state when the home page is open
                    var oSubHeaderProperties = {
                        controlType: "sap.m.Bar",
                        oControlProperties: {
                            id: "subHeaderBar",
                            contentLeft: [new sap.m.Button({
                                text: "SubHeader Button Left",
                                press: function () {
                                    MessageToast.show("SubHeader Button Left pressed");
                                }
                            })
                            ],
                            contentRight: [new sap.m.Button({
                                text: "SubHeader Button Right",
                                press: function () {
                                    MessageToast.show("SubHeader Button Right pressed");
                                }
                            })
                            ],
                            contentMiddle: [new sap.m.Button({
                                text: "SubHeader Button Middle",
                                press: function () {
                                    MessageToast.show("SubHeader Button Middle pressed");
                                }
                            })
                            ]
                        },
                        bIsVisible: true,
                        bCurrentState: false,
                        aStates: ["home", "app"]
                    };

                    oRenderer.addShellSubHeader(oSubHeaderProperties);


                    //Display a toolarea item on the left side of the Fiori launchpad shell, in the launchpad states "App" and "Home".
                    var oToolAreaItem = new ToolAreaItem({
                        id: "acceleratedToolAreaItem",
                        icon: "sap-icon://accelerated",
                        press: function () {
                            MessageToast.show("ToolArea Item pressed");
                        }
                    });
                    oRenderer.showToolAreaItem(oToolAreaItem.getId(), false, ["home", "app"]);


                    //Create and display an item in the header of Fiori launchpad, in the launchpad states "App" and "Home".
                    //The new header item will be displayed on the left-hand side of the Fiori launchpad shell header.
                    oRenderer.addHeaderItem({
                        id: "bgHeaderItem",
                        icon: "sap-icon://background",
                        press: function () {
                            MessageToast.show("Header Item pressed");
                        }
                    }, true, false, ["home", "app"]);


                    //Create and display a shell header icon in Fiori launchpad, in the launchpad states "App" and "Home".
                    //The icon is displayed on the right side of the Fiori launchpad shell header or in a shell header overflow popup.
                    oRenderer.addHeaderEndItem({
                        id: "hwHeaderEndItem",
                        icon: "sap-icon://hello-world",
                        target: "https://www.google.com"
                    }, true, false, ["home", "app"]);


                    //Create an Action Button in Fiori launchpad, in the launchpad states "App" and "Home".
                    //The button will be displayed in the user actions menu, that is opened from the user button in the shell header.
                    var oUserActionProperties = {
                        controlType: "sap.m.Button",
                        oControlProperties: {
                            id: "userActionButton",
                            text: "Custom User Action",
                            icon: "sap-icon://action",
                            press: function () {
                                MessageToast.show("User Action Button pressed");
                            }
                        },
                        bIsVisible: true,
                        bCurrentState: false,
                        aStates: ["home", "app"]
                    };
                    oRenderer.addUserAction(oUserActionProperties);


                    //Add an entry to the User Settings dialog box including a Switch UI control that appears when the user clicks the new entry.
                    //NOTE: The example does not handle the User Settings action SAVE.
                    var oUserPreferencesEntry = {
                        title: "Custom Setting",
                        icon: "sap-icon://technical-object",
                        value: function () {
                            return jQuery.Deferred().resolve("Custom entry in the list");
                        },
                        content: function () {
                            return jQuery.Deferred().resolve(new Panel({
                                content: [
                                    new VBox({
                                        items: [
                                            new Label({ text: "Custom Label for UI Control" }),
                                            new Switch("customUserSettingSwitch")
                                        ]
                                    })
                                ]
                            }));
                        },
                        onSave: function () {
                            return jQuery.Deferred().resolve();
                        }
                    };

                    oRenderer.addUserPreferencesEntry(oUserPreferencesEntry);

                });
        },

        exit: function () {
            if (this._oShellContainer && this._onRendererCreated) {
                this._oShellContainer.detachRendererCreatedEvent(this._onRendererCreated);
            }
        }

    });
});
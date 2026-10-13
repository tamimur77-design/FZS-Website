document.addEventListener("DOMContentLoaded", function () {


    /* =========================
       BANGLADESH MAP
    ========================= */

    const map = L.map("bdMap", {

        zoomControl: true,

        scrollWheelZoom: false

    }).setView(

        [23.6850, 90.3563],

        7

    );


    /* =========================
       MAP BACKGROUND
    ========================= */

    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            attribution:
                "&copy; OpenStreetMap contributors"

        }

    ).addTo(map);


    /* =========================
       REAL 8 DIVISION GEOJSON
    ========================= */

    const geoJsonURL =
        "https://raw.githubusercontent.com/yasserius/bangladesh_geojson_shapefile/main/bangladesh_geojson_adm1_8_divisions_bibhags.json";


    /* =========================
       BANGLA NAMES
    ========================= */

    const banglaNames = {

        dhaka:
            "ঢাকা",

        chattogram:
            "চট্টগ্রাম",

        rajshahi:
            "রাজশাহী",

        khulna:
            "খুলনা",

        barisal:
            "বরিশাল",

        sylhet:
            "সিলেট",

        rangpur:
            "রংপুর",

        mymensingh:
            "ময়মনসিংহ"

    };


    /* =========================
       DIVISION COLORS
    ========================= */

    const colors = [

        "#1976D2",

        "#00897B",

        "#8E24AA",

        "#E53935",

        "#FB8C00",

        "#3949AB",

        "#43A047",

        "#6D4C41"

    ];


    /* =========================
       NAME FINDER
    ========================= */

    function getDivisionName(properties) {

        return (

            properties.NAME_1 ||

            properties.name ||

            properties.NAME ||

            properties.ADM1_EN ||

            properties.division ||

            properties.shapeName ||

            "Division"

        );

    }


    /* =========================
       LOAD MAP
    ========================= */

    fetch(geoJsonURL)

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "GeoJSON load failed"
                );

            }

            return response.json();

        })


        .then(function (data) {


            console.log(
                "Real Bangladesh map loaded."
            );


            const bdLayer = L.geoJSON(

                data,

                {


                    /* =================
                       MAP STYLE
                    ================= */

                    style: function (feature) {

                        const index =
                            data.features.indexOf(
                                feature
                            );

                        return {

                            color: "#ffffff",

                            weight: 2,

                            fillColor:
                                colors[
                                    index %
                                    colors.length
                                ],

                            fillOpacity: 0.82

                        };

                    },


                    /* =================
                       EACH DIVISION
                    ================= */

                    onEachFeature:
                    function (
                        feature,
                        layer
                    ) {


                        const properties =
                            feature.properties || {};


                        const englishName =
                            getDivisionName(
                                properties
                            );


                        const lowerName =
                            englishName
                                .toLowerCase();


                        let banglaName =
                            englishName;


                        /* =================
                           NAME CONVERSION
                        ================= */

                        if (
                            lowerName.includes(
                                "dhaka"
                            )
                        ) {

                            banglaName =
                                banglaNames.dhaka;

                        }

                        else if (
                            lowerName.includes(
                                "chatt"
                            )
                        ) {

                            banglaName =
                                banglaNames.chattogram;

                        }

                        else if (
                            lowerName.includes(
                                "raj"
                            )
                        ) {

                            banglaName =
                                banglaNames.rajshahi;

                        }

                        else if (
                            lowerName.includes(
                                "khul"
                            )
                        ) {

                            banglaName =
                                banglaNames.khulna;

                        }

                        else if (
                            lowerName.includes(
                                "bar"
                            )
                        ) {

                            banglaName =
                                banglaNames.barisal;

                        }

                        else if (
                            lowerName.includes(
                                "syl"
                            )
                        ) {

                            banglaName =
                                banglaNames.sylhet;

                        }

                        else if (
                            lowerName.includes(
                                "rang"
                            )
                        ) {

                            banglaName =
                                banglaNames.rangpur;

                        }

                        else if (
                            lowerName.includes(
                                "mym"
                            )
                        ) {

                            banglaName =
                                banglaNames.mymensingh;

                        }


                        /* =================
                           HOVER NAME
                        ================= */

                        layer.bindTooltip(

                            banglaName,

                            {

                                sticky: true

                            }

                        );


                        /* =================
                           CLICK
                        ================= */

                        layer.on(

                            "click",

                            function () {


                                document
                                    .getElementById(
                                        "divisionTitle"
                                    )
                                    .innerText =
                                    banglaName +
                                    " বিভাগ";


                                document
                                    .getElementById(
                                        "divisionText"
                                    )
                                    .innerText =
                                    "আপনি " +
                                    banglaName +
                                    " বিভাগ নির্বাচন করেছেন।";


                            }

                        );


                        /* =================
                           MOUSE OVER
                        ================= */

                        layer.on(

                            "mouseover",

                            function (event) {


                                event.target
                                    .setStyle({

                                        weight: 4,

                                        color: "#111",

                                        fillOpacity: 1

                                    });


                                event.target
                                    .bringToFront();


                            }

                        );


                        /* =================
                           MOUSE OUT
                        ================= */

                        layer.on(

                            "mouseout",

                            function (event) {


                                bdLayer
                                    .resetStyle(
                                        event.target
                                    );


                            }

                        );

                    }

                }

            );


            /* =================
               ADD TO MAP
            ================= */

            bdLayer.addTo(map);


            /* =================
               FIT BANGLADESH
            ================= */

            map.fitBounds(

                bdLayer.getBounds(),

                {

                    padding: [
                        20,
                        20
                    ]

                }

            );

        })


        .catch(function (error) {


            console.error(error);


            document
                .getElementById(
                    "divisionTitle"
                )
                .innerText =
                "Map load হয়নি";


            document
                .getElementById(
                    "divisionText"
                )
                .innerText =
                "Internet connection check করে আবার Refresh করো.";

        });


    /* =========================
       HERO BUTTON
    ========================= */

    window.scrollToMap =
        function () {

            document
                .querySelector(
                    ".map-section"
                )
                .scrollIntoView({

                    behavior: "smooth"

                });

        };


});
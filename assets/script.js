//holds lattidute, longitute and address of your location
var lat = '';
var lng = '';
var address = '';

//geocoder that makes use of lattitude and longitutde from navigator.geolocaiton
var geocoder = new google.maps.Geocoder();
window.onload = getLocation;


//automatically gets location
function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        //if user blocks location services.
        document.getElementById("warn").innerHTML = "<p> Location Services not turned on!</p> <p>Please search for zipcode</p>"

    }
}

//print out position for debugging purposes
function showPosition(position) {
    document.getElementById("location").innerText = position.coords.latitude + " " + position.coords.longitude;
    //searches and outputs all the possible nearby places
    outputResults(position.coords.latitude, position.coords.longitude)
}

//if the users wants to search by zip code
function zipToLocation() {
    var address = document.getElementById("zipcodebox").value;
    geocoder.geocode({'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();

                //printed for debug purposes
                document.getElementById("location").innerText = lat + " " + lng;
                //searches and outputs all the possible nearby places
                outputResults(lat, lng);
            }

        }
    );

}


function loadMore() {

}
function outputResults(lat, lng) {
// what is 500
//what should type be
    var request = {
        location: new google.maps.LatLng(lat, lng),
        radius: '750',
        type: 'restaurant' // can only search for one type
    };
    var container = document.getElementById('results');

    var service = new google.maps.places.PlacesService(container);
    service.nearbySearch(request, callback);

    function callback(results, status) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {

            //random result:
            var item = results[Math.floor(Math.random() * results.length)];

            console.log(results.length);


            var winner = ''
            winner += '<h2>Winner!!</h2>';

            winner += '<p>';

            if ("photos" in item) {
                winner += '<img class="img-fluid" src="' + item.photos[0].getUrl({
                        'maxWidth': 100,
                        'maxHeight': 100
                    }) + '">'
            } else {
                winner += '<img class="img-fluid" src="assets/images/no_image.gif">';
            }

            winner += item.name + '<br />';
            winner += item.vicinity + '<br />';
            winner += item.rating + '<br />';
            winner += '</p><hr>';

            //reset the winner's html
            document.getElementById('winner').innerHTML = winner;
            var html = '';
            for (var i = 0; i < results.length; i++) {

                /* wrapper */

                if (i % 2 == 0) {
                    html += '<div class="row">'
                }

                html += '<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 item">';
                html += '<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">';


                //some restraunts don't have photos
                if (results[i].hasOwnProperty("photos")) {
                    html += '<img class="img-fluid" src="' + results[i].photos[0].getUrl({
                            'maxWidth': 200,
                            'maxHeight': 200
                        }) + '">'
                } else {
                    html += '<img class="img-fluid" src="assets/images/no_image.gif">'
                }
                html += '</div>';
                html += '<div class="col-lg-8 col-md-6 col-sm-12 col-xs-12">';


                html += '<h4>' + results[i].name + '</h4>';

                html += '<p>';
                html += results[i].vicinity + '<br />';

                if (results[i].hasOwnProperty("rating")) {
                    html += results[i].rating + '<br />';
                } else {
                    html += 'Not rated' + '<br />';
                }

                /* end of wrapper */
                html += '</p>';
                html += '</div>';
                html += '</div>';

                if (i % 2 != 0) {
                    html += '</div>'
                }
            }
            html += '</div>'
            html += '<div class="row"><div class="text-center col-md-12 col-lg-12 col-sm-12"><button type="button" class="btn btn-primary load-button" onclick="loadMore()">Load More</button></div></div>';
            document.getElementById("results").innerHTML = html;
        }
    }
}

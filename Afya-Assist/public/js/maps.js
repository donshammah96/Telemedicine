function initMap() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const patientLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                const map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 12,
                    center: patientLocation,
                });
                const marker = new google.maps.Marker({
                    position: patientLocation,
                    map: map,
                });
            },
            () => {
                handleLocationError(true, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, pos) {
    const infoWindow = new google.maps.InfoWindow();
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}
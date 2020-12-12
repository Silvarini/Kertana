var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
    polygon: true,
    trash: true
    }
    });
    map.addControl(draw);
     
    map.on('draw.create',updateArea);
    map.on('draw.delete',updateArea);
    map.on('draw.update',updateArea);
     
    function updateArea(e) {
    var data = draw.getAll();

    if (data.features.length > 0) {
        var area = turf.area(data);
        console.log(data.features[0].geometry.coordinates)
    } 
    else {
        if (e.type !== 'draw.delete')
        alert('Use the draw tools to draw a polygon!');
        }
    }
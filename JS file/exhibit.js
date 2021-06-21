var json_data;
$.ajaxSettings.async = false;

//getJSON from github and restore into a variable
jQuery.when(
    jQuery.getJSON("https://raw.githubusercontent.com/hangyu98/IMSP/master/data/cytoscape/cytoscape_with_prediction_with_position.json")
).done(function(json) {
    getjson(json)
});

function getjson(data) {
    json_data = data;
}

$.ajaxSettings.async = true;

console.log(json_data['elements']['nodes']);
console.log(json_data['elements']['edges']);
// console.log(json_data['elements']['edges'][0].position['x']);

$(function() {
    var cy = cytoscape({
        container: document.getElementById('cy'),
        style: [{
                selector: 'node',
                style: {
                    width: 50,
                    height: 50,
                    'background-color': '#61bffc',
                    "text-valign": "center",
                    "color": "white",
                    content: 'data(id)',
                }
            },
            {
                selector: 'edge',
                css: {
                    'curve-style': 'bezier',
                    "target-arrow-shape": "triangle",
                    "line-color": "black"
                }
            }
        ],
        layout: {
            name: 'breadthfirst',
            directed: true,
            padding: 10,
            /* color: "#ffff00",*/
            fit: true
        },

    });
    var virus_node = [];
    var host_node = [];
    for (let i = 0; i < json_data['elements']['nodes'].length; i++) {
        cy.add([{
            group: 'nodes',
            data: { id: json_data['elements']['nodes'][i].data['id'], name: json_data['elements']['nodes'][i].data['disp'] },
            position: { x: json_data['elements']['nodes'][i].position['x'], y: json_data['elements']['nodes'][i].position['y'] }
        }])
        if (json_data['elements']['nodes'][i].data['group'] == 'virus protein') {
            virus_node.push(json_data['elements']['nodes'][i]);
        } else {
            host_node.push(json_data['elements']['nodes'][i]);
        }
    }

    for (let i = 0; i < json_data['elements']['edges'].length; i++) {
        cy.add([{
            group: 'edges',
            data: { id: json_data['elements']['edges'][i].data['id'], source: json_data['elements']['edges'][i].data['source'], target: json_data['elements']['edges'][i].data['target'] },
        }])
    }


    for (let j = 0; j < virus_node.length; j++) {
        changenodecolor(virus_node[j].data['id'], 'green');

    }

    for (let k = 0; k < host_node.length; k++) {
        changenodecolor(host_node[k].data['id'], 'blue');
    }

    function changenodecolor(id, color) {
        for (let i = 0; i < cy.elements('node').length; i++) {
            if (cy.elements('node')[i].id() == id) {
                cy.elements('node')[i].style('background-color', color);
                color == 'white' ? changetextcolor(id, 'black') : changetextcolor(id, 'white');
            }
        }
    }

    function changetextcolor(id, color) {
        for (let i = 0; i < cy.elements('node').length; i++) {
            if (cy.elements('node')[i].id() == id) {
                cy.elements('node')[i].style('color', color);
            }
        }
    }
})
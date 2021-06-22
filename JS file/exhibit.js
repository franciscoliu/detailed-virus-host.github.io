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

    var virus_node = []; //Node represents virus group
    var host_node = []; //Node represents host group
    var origin_edge = [];
    var predicted_edge = [];
    var node_info_map = new Map();

    for (let i = 0; i < json_data['elements']['nodes'].length; i++) {
        // node_info_map[String(json_data['elements']['nodes'][i].data['id'])] = String(json_data['elements']['nodes'][i].data['disp'])
        node_info_map.set(json_data['elements']['nodes'][i].data['id'], json_data['elements']['nodes'][i].data['disp'])
    }


    //Add corresponding nodes to each array
    for (let i = 0; i < json_data['elements']['nodes'].length; i++) {
        cy.add([{
            group: 'nodes',
            data: { id: json_data['elements']['nodes'][i].data['id'], name: json_data['elements']['nodes'][i].data['disp'] },
            position: { x: json_data['elements']['nodes'][i].position['x'], y: json_data['elements']['nodes'][i].position['y'] }
        }]);
        if (json_data['elements']['nodes'][i].data['group'] == 'virus protein') {
            virus_node.push(json_data['elements']['nodes'][i]);
        } else {
            host_node.push(json_data['elements']['nodes'][i]);
        }
    }

    //Connect edges between nodes
    for (let i = 0; i < json_data['elements']['edges'].length; i++) {
        cy.add([{
            group: 'edges',
            data: { id: json_data['elements']['edges'][i].data['id'], source: json_data['elements']['edges'][i].data['source'], target: json_data['elements']['edges'][i].data['target'] },
        }]);
        if (json_data['elements']['edges'][i].data['etype'] == 'original') {
            origin_edge.push(json_data['elements']['edges'][i]);
        } else {
            predicted_edge.push(json_data['elements']['edges'][i]);
        }
    }



    //Assign different colors to different nodes
    // for (let j = 0; j < virus_node.length; j++) {
    //     changenodecolor(virus_node[j].data['id'], 'green');

    // }

    // for (let k = 0; k < host_node.length; k++) {
    //     changenodecolor(host_node[k].data['id'], 'blue');
    // }

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

    cy.on('mouseover', 'node', function(event) {
        var evtTarget = event.target;
        evtTarget.qtip({
            content: node_info_map.get(this.id()),
            show: {
                event: event.type,
                ready: true
            },
            hide: {
                event: "mouseout unfocus"
            }
        }, event);
    });

    cy.on('click', 'node', function(evt) {
        console.log(evt.target);
        // console.log('clicked ' + this.id());
        var div = document.createElement('div');
        var button = document.createElement('BUTTON');
        var text = document.createTextNode("Delete");
        button.appendChild(text);
        button.style.position = 'absolute';
        button.style.left = 0;
        button.style.margin = "5px";
        button.style.padding = "3px";
        div.style.height = "160px";
        div.style.borderStyle = "solid";
        div.style.borderColor = "grey";
        div.style.overflowY = "scroll";
        $(div).addClass("inner").html("Node: " + node_info_map.get(evt.target.id()));
        $('#info').append(div);
        $(div).append(button);
        var divs = document.getElementsByTagName('div');
        for (let i = 0; i < divs.length; i++) {
            if (divs[i].innerHTML.indexOf(evt.target) == -1) {

            }
        }
        $(document).on('click', ':button', function() {
            $(this).parent().remove();
        });
    });

    cy.on('click', 'edge', function(evt) {
        // console.log('clicked ' + this.id());
        var div = document.createElement('div');
        var button = document.createElement('BUTTON');
        var text = document.createTextNode("Delete");
        button.appendChild(text);
        button.style.position = 'absolute';
        button.style.left = 0;
        button.style.margin = "5px";
        button.style.padding = "3px";
        div.style.height = "150px";
        div.style.borderStyle = "solid";
        div.style.borderColor = "grey";
        div.style.overflowY = "scroll";

        $(div).addClass("inner").html("Edge: " + evt.target.id());
        $('#info').append(div);
        $(div).append(button);
        $(document).on('click', ':button', function() {
            $(this).parent().remove();
        });
    });
});
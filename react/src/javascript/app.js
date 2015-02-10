var React = require('react');
var Backbone = require('backbone');
var $ = jQuery = require('jquery');
var _ = require('underscore');
require('backbone-react-component');
require('backbone-relational');
Backbone.$ = $;

var bootstrap = require('bootstrap');

config = {
    url: "http://katrin.kit.edu/newstatus/katrin/api/sql/",
    server: "orca",
};

var ToggleContent = React.createClass({
    render: function() {
        var rightAlign = {
            marginRight: '10px',
            float: 'right'
        }
        var leftAlign = {
            marginLeft: '10px',
            float: 'left'
        };
        return (
            <div className={'toggle-content'}>
                <div><b style={leftAlign}>ID</b> <span style={rightAlign}>{this.props.id}</span></div><br/>
                <div><b style={leftAlign}>IP</b> <span style={rightAlign}>{this.props.ip_address}</span></div><br/>
                <div><b style={leftAlign}>Time to go</b> <span style={rightAlign}>{this.props.timeToGo}</span></div><br/>
            </div>
            );
    }
});

var MyComponent = React.createClass({
    mixins: [Backbone.React.Component.mixin],
    getInitialSate: function() {
        return {showMore: false}
    },
    onClick: function () {
        this.setState({showMore: !this.state.showMore})
    },
    millisecondsToStr: function (milliseconds) {
        // TIP: to find current time in milliseconds, use:
        // var  current_time_milliseconds = new Date().getTime();

        function numberEnding (number) {
            return (number > 1) ? 's' : '';
        }

        var temp = Math.floor(milliseconds / 1000);
        var years = Math.floor(temp / 31536000);
        if (years) {
            return years + ' year' + numberEnding(years);
        }
        //TODO: Months! Maybe weeks? 
        var days = Math.floor((temp %= 31536000) / 86400);
        if (days) {
            return days + ' day' + numberEnding(days);
        }
        var hours = Math.floor((temp %= 86400) / 3600);
        if (hours) {
            return hours + ' hour' + numberEnding(hours);
        }
        var minutes = Math.floor((temp %= 3600) / 60);
        if (minutes) {
            return minutes + ' minute' + numberEnding(minutes);
        }
        var seconds = temp % 60;
        if (seconds) {
            return seconds + ' second' + numberEnding(seconds);
        }
        return 'less than a second'; //'just now' //or other string you like;
    },
    render: function () { 
        var arrowStyle = {
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '20px'
        };
        var rightAlign = {
            marginRight: '10px',
            float: 'right'
        }
        var leftAlign = {
            marginLeft: '10px',
            float: 'left'
        };
        return (
            <div>
            <h4>{this.props.name}</h4>
            <div><b style={leftAlign}>Experiment</b> <span style={rightAlign}>{this.props.experiment}</span></div><br/>
            <div><b style={leftAlign}>State</b> <span style={rightAlign}>{this.props.state ? 'Running' : 'Stopped'}</span></div><br/>
            <div><b style={leftAlign}>Run time</b> <span style={rightAlign}>{this.millisecondsToStr(this.props.uptime*1000)}</span></div><br/>
            { this.state.showMore 
                ? <div><ToggleContent {...this.props} /> <img src="./images/arrow_up.png" alt="toggle" style={arrowStyle} onClick={this.onClick} /></div>
                : <img src="./images/arrow_down.png" alt="toggle" style={arrowStyle} onClick={this.onClick} /> }
            </div>);
    }
});

var Run = Backbone.RelationalModel.extend({
    parse: function(resp) {
        if (typeof resp.data === 'undefined')
            return resp;
        else
            return resp.data[0];
    }
});

var Runs = Backbone.Collection.extend({
    model: Run,
    parse: function(resp) {
        return resp.data;
    }
});

var Machine = Backbone.Model.extend({
    parse: function(resp) {
        if (typeof resp.data === 'undefined')
            return resp;
        else
            return resp.data[0];
    }
});

var Machines = Backbone.Collection.extend({
    model: Machine,
    parse: function(resp) {
        return resp.data;
    },

});


function setup0() {
    machines.fetch({
        error: function(c) {
            console.log('oops');
        },
        success: function(c) {
            _.each(c.models, function(model, key) {
                var _id = 'block' + (++key);
                React.render(<MyComponent model={model} />, document.getElementById(_id));    
            });
        }
    });
}

function setup() {
    $.when( machines.fetch(), runs.fetch()).then( function(){
        var run_info = {}
        _.each(runs.models, function(run) {
            var run = run.attributes;
            run_info[run.machine_id] = run;
        });
        _.each(machines.models, function(machine, key) {
            var run = run_info[machine.attributes.machine_id];
            _.extend(machines.models[key].attributes, run);
            React.render(<MyComponent model={machines.models[key]} />, document.getElementById('block'+(key+1)));
        });
    });
}

function update() {
    $.when( machines.fetch(), runs.fetch()).then( function(){
        var run_info = {}
        _.each(runs.models, function(run) {
            run_info[run.machine_id] = run.attributes;
        });
        _.each(machines.models, function(machine, key) {
            var run = run_info[machine.attributes.machine_id];
            _.extend(machines.models[key].attributes, run);
        });

    });
}

var url = config.url + config.server + "/";

machines = new Machines({});
machines.url = url+'machines';

runs = new Runs({});
runs.url = url + 'runs';

//setup0();
setup();


setInterval(function() {
    update();
}, 10000);

$(document).ready(function() {
    console.log('ready'); 
});

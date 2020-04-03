import React     from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Layout    from './api/layout';
import Day       from './day';
import XLabels   from './x-labels';
import YLabels   from './y-labels';
import EventsCollection from './api/events-collection';

export default class Dayz extends React.Component {

    static EventsCollection = EventsCollection;

    static propTypes = {
        date:              PropTypes.object.isRequired,
        events:            PropTypes.instanceOf(EventsCollection),
        technicians:        PropTypes.array,
        display:           PropTypes.oneOf(['month', 'week', 'day']),
        timeFormat:        PropTypes.string,
        dateFormat:        PropTypes.string,
        displayHours:      PropTypes.array,
        onEventClick:      PropTypes.func,
        editComponent:     PropTypes.func,
        onEventResize:     PropTypes.func,
        dayEventHandlers:  PropTypes.object,
        locale:            PropTypes.string,
        highlightDays:     PropTypes.oneOfType(
            [PropTypes.array, PropTypes.func],
        ),
        weekStartsOn:      PropTypes.oneOf([0, 1]),
        mode:              PropTypes.string,
        daynumber:         PropTypes.number,
        specialHeader:     PropTypes.object,
        onHeaderClick:     PropTypes.func
    }

    static defaultProps = {
        display: 'week',
        locale: 'en',
    }

    constructor(props) {
        super(props);
        this.layoutFromProps();
    }

    componentDidUpdate(prevProps) {
        // don't calculate layout if update is due to state change
        if (prevProps !== this.props) {
            this.layoutFromProps();
            this.forceUpdate();
        }
    }

    componentWillUnmount() {
        this.detachEventBindings();
    }

    detachEventBindings() {
        if (this.props.events) { this.props.events.off('change', this.onEventAdd); }
    }

    onEventsChange() {
        this.forceUpdate();
    }

    layoutFromProps() {
        const { props } = this;
        if (this.props && props.events) {
            this.detachEventBindings();
            props.events.on('change', this.onEventsChange, this);
        }
        this.layout = new Layout(Object.assign({}, props));
    }

    get days() {
        const days = [];
        const day = moment(this.props.date).locale(this.props.locale);
        for (let i = 0; i < this.props.daynumber; i += 1) {
            days.push(day.clone().add(i, 'day'));
        }
        return days;
    }

    renderDays(mode, technicians) {
        if ('schedule' === mode) {
            const day = this.props.date;
            return technicians.map((technician, index) => (
                <Day
                    technician={technician}
                    mode="schedule"
                    key={`${day.format('YYYYMMDD')}-${index}`}
                    day={day}
                    position={index}
                    layout={this.layout}
                    editComponent={this.props.editComponent}
                    handlers={this.props.dayEventHandlers}
                    eventHandlers={this.props.eventHandlers}
                    onEventClick={this.props.onEventClick}
                    onEventResize={this.props.onEventResize}
                />
            ));
        }

        return this.days.map((day, index) => (
            <Day
                key={day.format('YYYYMMDD')}
                day={day}
                position={index}
                layout={this.layout}
                editComponent={this.props.editComponent}
                handlers={this.props.dayEventHandlers}
                eventHandlers={this.props.eventHandlers}
                onEventClick={this.props.onEventClick}
                onEventResize={this.props.onEventResize}
            />
        ));
    }

    render() {
        const classes = ['dayz', this.props.display];
        return (
            <div className={classes.join(' ')}>
                <XLabels
                    date={this.props.date}
                    display={this.props.display}
                    dateFormat={this.props.dateFormat}
                    locale={this.props.locale}
                    weekStartsOn={this.props.weekStartsOn}
                    mode={this.props.mode}
                    technicians={this.props.technicians}
                    daynumber={this.props.daynumber}
                    specialHeader={this.props.specialHeader}
                    onHeaderClick={this.props.onHeaderClick}
                />
                <div className="body">
                    <YLabels
                        layout={this.layout}
                        display={this.props.display}
                        date={this.props.date}
                        timeFormat={this.props.timeFormat}
                    />
                    <div className="days">
                        {this.renderDays(this.props.mode, this.props.technicians)}
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

}

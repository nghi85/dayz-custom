import React  from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

export default class XLabels extends React.Component {

    static propTypes = {
        display:      PropTypes.oneOf(['month', 'week', 'day']),
        date:         PropTypes.object.isRequired,
        dateFormat:   PropTypes.string,
        locale:       PropTypes.string.isRequired,
        weekStartsOn: PropTypes.oneOf([0, 1]),
        mode:         PropTypes.string,
        technicans:   PropTypes.array,
        daynumber:    PropTypes.number
    }

    get days() {
        const days = [];

        if ('day' === this.props.display) {
            days.push(moment(this.props.date));
        } else {
            if (this.props.mode !== "schedule") {
                let startOfType = 'week';
                const day = moment(this.props.date).locale(this.props.locale);
                if (this.props.weekStartsOn !== undefined) {
                    startOfType = 'isoWeek';
                    day.startOf(startOfType);
                    if (0 === this.props.weekStartsOn && 1 === day.isoWeekday()) {
                        day.subtract(1, 'day');
                    }
                } else {
                    day.startOf(startOfType);
                }
                for (let i = 0; i < this.props.daynumber; i += 1) {
                    days.push(day.clone().add(i, 'day'));
                }
            } else {
                console.log(this.props.technicans);
                for (let i = 0; i < this.props.technicans.length; i += 1) {
                    days.push(this.props.technicans[i]);
                }
            }
        }
        return days;
    }

    get dateFormat() {
        const defaultFormat = 'month' === this.props.display ? 'dddd' : 'dddd DD/MM/YYYY';
        return this.props.dateFormat || defaultFormat;
    }

    render() {
        if (this.props.mode !== "schedule") {
            return (
                <div className="x-labels">
                    <div className="time-note-label">Time *</div>
                    {this.days.map(day => <div key={day.format('YYYYMMDD')} className="day-label">
                        {day.locale(this.props.locale).format(this.dateFormat)}
                    </div>)}
                </div>
            );
        } else {
            return (
                <div className="x-labels">
                    <div className="time-note-label">Time *</div>
                    {this.days.map(day => <div className="day-label technican-link">
                        {day}
                    </div>)}
                </div>
            );
        }
    }

}

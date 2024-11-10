import React, { useState } from "react";
import { format, addMinutes, isToday, isPast, startOfMonth, endOfMonth, addMonths, isBefore, isAfter, isSameMonth } from "date-fns";
import "../styles/components/DateTimePopup.css";
import api from '../services/api';

const DateTimePopup = ({ onClose, onConfirm }) => {
    const [selectedDates, setSelectedDates] = useState([]);
    const [times, setTimes] = useState({});
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleMonthSelect = (month) => {
        setCurrentMonth(month);
        setMonthDropdownOpen(false);
    };

    const handleDateClick = (date) => {
        const formattedDate = format(date, "yyyy-MM-dd");

        if (selectedDates.includes(formattedDate)) {
            setSelectedDates(
                selectedDates.filter((d) => d !== formattedDate)
            );
            const { [formattedDate]: _, ...rest } = times;
            setTimes(rest);
        } else {
            setSelectedDates((prevSelectedDates) => {
                const newSelectedDates = [...prevSelectedDates, formattedDate];
                return newSelectedDates.sort((a, b) => new Date(a) - new Date(b));
            });
            setTimes({ ...times, [formattedDate]: "" });
        }
    };

    const handleTimeChange = (date, selectedTime) => {
        const currentTime = new Date();
        const timeParts = selectedTime.split(":");
        const inputTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), timeParts[0], timeParts[1]);

        const minTime = addMinutes(currentTime, 30);

        if (isToday(new Date(date))) {
            if (isBefore(inputTime, minTime)) {
                if (selectedTime !== times[date]) {
                    setTimes({ ...times, [date]: format(minTime, "HH:mm") });
                }
            } else {
                setTimes({ ...times, [date]: selectedTime });
            }
        } else {
            setTimes({ ...times, [date]: selectedTime });
        }
    };

    const handleConfirm = () => {
        setIsButtonClicked(true); // Trigger the button fade-out effect
        setTimeout(() => {
            onConfirm(selectedDates.map((date) => ({ date, time: times[date] })));
            setIsClosing(true);
            setTimeout(() => {
                onClose();
            }, 300);
        }, 300); // Wait for the fade-out animation before confirming
    };

    const renderCalendarDays = () => {
        const startOfCurrentMonth = startOfMonth(currentMonth);
        const endOfCurrentMonth = endOfMonth(currentMonth);
        const days = [];
        const startDay = startOfCurrentMonth.getDay();
        const totalDays = endOfCurrentMonth.getDate();

        for (let i = 0; i < startDay; i++) {
            days.push(<div className="empty-day" key={`empty-${i}`} />);
        }

        const isTodayOverMidnight = () => {
            const currentTime = new Date();
            const thirtyMinutesLater = addMinutes(currentTime, 30);
            return thirtyMinutesLater.getDate() !== currentTime.getDate();
        };

        for (let i = 1; i <= totalDays; i++) {
            const day = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
            const formattedDate = format(day, "yyyy-MM-dd");
            const isDisabled = isPast(day) && !isToday(day) || (isToday(day) && isTodayOverMidnight());

            days.push(
                <button
                    key={i}
                    className={`calendar-day ${selectedDates.includes(formattedDate) ? "selected" : ""}`}
                    onClick={() => handleDateClick(day)}
                    disabled={isDisabled}
                >
                    {i}
                </button>
            );
        }
        return days;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(addMonths(currentMonth, -1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const isPrevMonthDisabled = isBefore(currentMonth, new Date());
    const isNextMonthDisabled = isAfter(currentMonth, addMonths(new Date(), 24));

    const getInitialTime = (date) => {
        if (isToday(new Date(date))) {
            const currentTime = addMinutes(new Date(), 30);
            return format(currentTime, "HH:mm");
        }
        return "00:00";
    };

    return (
        <div className={`date-time-popup-overlay ${isClosing ? "fade-out" : ""} ${isButtonClicked ? "fade-out" : ""}`}>
            <div className="date-time-popup-content">
                <button onClick={handleClose} className="close-popup-button">
                    &times;
                </button>
                <h2 className="text-center py-1">Select Dates and Times</h2>
                <div className="calendar-container">
                    <div className="calendar-box">
                        <div className="calendar-header">
                            <button className="arrow-button" onClick={handlePrevMonth}
                                    disabled={isPrevMonthDisabled}><i className="bi bi-arrow-left-square-fill"></i>
                            </button>
                            <div className="month-selector">
                                <button
                                    className="month-input"
                                    onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                                >
                                    {format(currentMonth, "MMMM yyyy")}
                                </button>
                                {monthDropdownOpen && (
                                    <ul className="month-dropdown">
                                        {Array.from({length: 24}).map((_, i) => {
                                            const month = addMonths(new Date(), i);
                                            return (
                                                <li
                                                    key={i}
                                                    onClick={() => handleMonthSelect(month)}
                                                    className={`month-item ${isSameMonth(month, currentMonth) ? "selected" : ""}`}
                                                >
                                                    {format(month, "MMMM yyyy")}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                            <button className="arrow-button" onClick={handleNextMonth}
                                    disabled={isNextMonthDisabled}><i className="bi bi-arrow-right-square-fill"></i>
                            </button>
                        </div>
                        <div className="calendar-days-header">
                            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                        </div>
                        <div className="calendar-days">{renderCalendarDays()}</div>
                    </div>
                </div>
                <div className="scrollable-time-selection">
                    {selectedDates.map((date) => (
                        <div key={date} className="time-selector">
                            <h3>{format(new Date(date), "EEEE, MMMM d, yyyy")}</h3>
                            <input
                                type="time"
                                value={times[date] || getInitialTime(date)}
                                onChange={(e) => handleTimeChange(date, e.target.value)}
                                className="time-input"
                                min={isToday(new Date(date)) ? getInitialTime(date) : undefined}
                                required
                            />
                        </div>
                    ))}
                </div>
                <div className="popup-footer">
                    <button className={`confirm-button align-items-center ${isButtonClicked ? "fade-out" : ""}`} onClick={handleConfirm}
                            disabled={!selectedDates.length || selectedDates.some((date) => !times[date])}>
                        Activate Workflow
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DateTimePopup;

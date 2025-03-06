import * as React from "react";

interface IAttendanceRateIconProps {
    content: string | number;
    diameter?: number; // optional, default size
    backgroundColor?: string;
}

const AttendanceRateIcon: React.FC<IAttendanceRateIconProps> = ({
    content,
    diameter = 32,
}) => {
    const circleStyle: React.CSSProperties = {
        width: diameter,
        height: diameter,
        borderRadius: "50%",
        border: `1px solid rgb(97, 97, 97)`,
        backgroundColor: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: 'rgb(97, 97, 97)',
        fontWeight: "bold",
    };

    return <div style={circleStyle}>{content}</div>;
};

export default AttendanceRateIcon;
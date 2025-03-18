import * as React from 'react';
import { useState, useEffect } from 'react';
import AttendanceRateIcon from './AttendanceRate';
import {
	DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn, IDetailsListStyles, CheckboxVisibility,
	IDetailsFooterProps, DetailsRow, ConstrainMode, IDetailsRowStyles, IDetailsColumnProps, IDetailsListProps,
	IDetailsRowBaseProps
} from '@fluentui/react/lib/DetailsList';
import { IconButton } from '@fluentui/react/lib/Button';
import { ChevronDownRegular, ChevronRightRegular, StarRegular, CaretUpRegular, CheckmarkFilled } from "@fluentui/react-icons";
import { IRenderFunction, IObjectWithKey } from '@fluentui/react/lib/Utilities';
import { TextField, ITextFieldProps, ITextFieldStyleProps, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { getTheme } from '@fluentui/react/lib/Styling';
import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import {
	FluentProvider, webLightTheme, Avatar, buttonClassNames,
	tokens,
	Button,
	Spinner,
} from '@fluentui/react-components';
import { FontIcon, Icon } from '@fluentui/react/lib/Icon';
import { ScrollablePane, ScrollbarVisibility } from "@fluentui/react/lib/ScrollablePane";
export interface IExpandableDetailsListProp {
	context: any;
	dataSet: ComponentFramework.PropertyTypes.DataSet;
	paging: any;
	notifyOutputChanged: () => void;

}
import { SendRegular, CheckmarkRegular } from "@fluentui/react-icons";
import { makeStyles, shorthands } from "@fluentui/react-components";

type DataSet = ComponentFramework.PropertyHelper.DataSetApi.EntityRecord & IObjectWithKey;
type LoadingState = "initial" | "loading" | "loaded";

const getStudentInfoUrl = "https://prod-27.uaenorth.logic.azure.com:443/workflows/28e4d484d3f744528344e98c03470d26/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=nywJ0xHyGbI5R1e_j67zhC6mnCbUtMnAhW55g2Dpf3U";
const getSchoolSettingUrl = "https://prod-31.uaenorth.logic.azure.com:443/workflows/1ea987348dcd488aad45b8f66aefd670/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=HVVTB5sy6pquxxEFNkbtTj1TiaZJVFRyjE1Qsn1QNZY";

const theme = getTheme();

const wrapStackTokens: IStackTokens = { childrenGap: 60 };
const innerTableStackTokens: IStackTokens = { childrenGap: 30 };
const wrapStackTokensInnerButton: IStackTokens = { childrenGap: 7 };
const headingStackTokens: IStackTokens = { childrenGap: 30 };
const studentStackTokens: IStackTokens = { childrenGap: 10 };
const weekDayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//#region Styles
const gridStyles: Partial<IDetailsListStyles> = {
	root: {
		selectors: {
			'& [role=grid]': {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'start',
				//height: 'var(--gridMainHeight)',
				height: '700px',
				width: '100%',
			},
		},
	},
	headerWrapper: {
		flex: '0 0 auto',
		width: '100%',
	},
	contentWrapper: {
		flex: '1 1 auto',
		width: '100%',
		overflowX: 'hidden',
		//overflow: 'auto'
	},
};
const nonSelectedRowClass = mergeStyles({
	// selectors: {
	// 	'.ms-DetailsRow-cell': {
	// 		selectors: {
	// 			':hover': {
	// 				backgroundColor: '#e0e0e0 !important',
	// 			},
	// 		},
	// 	},
	// },
	padding: '1px 0 !important',
	".ms-DetailsRow-cell": {
		":hover": {
			borderRadius: '4px',
			backgroundColor: '#e0e0e0 !important',
		}
		// selectors: {
		// 	':hover': {
		// 		backgroundColor: '#e0e0e0 !important',
		// 	},
		// },
	}
});

const noBgButtonClass = mergeStyles({
	border: 'none !important',
	backgroundColor: 'transparent !important',
	':hover': {
		backgroundColor: 'transparent !important',
	},
	':active': {
		backgroundColor: 'transparent !important',
	},
	':focus': {
		backgroundColor: 'transparent !important',
	},
});

const useClasses = makeStyles({
	icon24: { fontSize: "24px" },
	icon32: { fontSize: "32px" },
	icon48: {
		width: '64px',
		height: '64px',
		filter: 'drop-shadow(0 0 2px black)',
		fill: 'black',
	},
});

const markAllButtonStyles = makeStyles({
	wrapper: {
		columnGap: "15px",
		display: "flex",
	},
	buttonNonInteractive: {
		backgroundColor: tokens.colorNeutralBackground1,
		border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
		color: tokens.colorNeutralForeground1,
		cursor: "default",
		pointerEvents: "none",

		[`& .${buttonClassNames.icon}`]: {
			color: tokens.colorStatusSuccessForeground1,
		},
	},
});

const selectedRowClass = mergeStyles({
	// selectors: {
	// 	'.ms-DetailsRow-cell': {
	// 		selectors: {
	// 			':hover': {
	// 				borderRadius: '2px',
	// 				backgroundColor: 'rgba(0, 0, 0, 0.1) !important',
	// 			},
	// 		},
	// 	},
	// },
	padding: '1px 0 !important',
	".ms-DetailsRow-cell": {
		":hover": {
			borderRadius: '4px',
			backgroundColor: 'rgba(0, 0, 0, 0.1) !important',
		}
	}
});

const editingCellOutlineClass = mergeStyles({
	outline: '2px solid rgb(15, 108, 189) !important',
	borderRadius: '4px !important',
	paddingLeft: '0px !important',
	paddingRight: '0px !important',
});

const greenColumnClass = mergeStyles({
	width: '100%',
	selectors: {
		"&.ms-DetailsRow-cell": {
			position: "relative",
			backgroundColor: "transparent !important",
			width: '100%',
			//overlay pseudo-element
			"::before": {
				content: '""',
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0, 128, 0, 0.06)", //0.06% alpha
				pointerEvents: "none",
				zIndex: 1,
			},
		},
	},
	"& > *": {
		zIndex: 2,
	}
});

const blueColumnClass = mergeStyles({
	position: "relative",
	width: '100%',
	backgroundColor: "transparent !important",
	"::before": {
		width: '100%',
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(228, 236, 247, 0.7)",
		pointerEvents: "none",
		zIndex: 1,
	},
	"& > *": {
		zIndex: 2,
	}
});

const greenHeaderClass = mergeStyles({
	position: "relative",
	width: '100%',
	backgroundColor: "transparent !important",
	"::before": {
		width: '100%',
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 128, 0, 0.06)",
		pointerEvents: "none",
		zIndex: 1,
	},
	selectors: {
		"& > *": {
			zIndex: 2,
		},
	},
});

const blueHeaderClass = mergeStyles({
	position: "relative",
	width: '100%',
	backgroundColor: "transparent !important",
	"::before": {
		width: '100%',
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(228, 236, 247, 0.5)",
		pointerEvents: "none",
		zIndex: 1,
	},
	selectors: {
		"& > *": {
			zIndex: 2,
		},
	},
});
//#endregion

//#region Helper Functions
// Helper function to determine if a date is in the current week
function isDateInCurrentWeek(date: Date): boolean {
	const today = new Date();
	const dayOfWeek = today.getDay(); // Sunday is 0, Saturday is 6

	// Get start of the week (Sunday)
	const startOfWeek = new Date(today);
	startOfWeek.setDate(today.getDate() - dayOfWeek);
	startOfWeek.setHours(0, 0, 0, 0); // set to start of day

	// Get end of the week (Saturday)
	const endOfWeek = new Date(today);
	endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));
	endOfWeek.setHours(23, 59, 59, 999); // set to end of day

	return date >= startOfWeek && date <= endOfWeek;
}

//#endregion
const initialItems = [
	{ key: '1', StudentInfo: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '2', StudentInfo: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '3', StudentInfo: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '4', StudentInfo: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '5', StudentInfo: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '6', StudentInfo: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '7', StudentInfo: 'Item 2-A', B: 'Item 2-B', C: 'Item 2-C', D: 'Item 2-D', E: 'Item 2-E', F: 'Item 2-F' },
];

const ExpandableDetailsList: React.FunctionComponent<IExpandableDetailsListProp> = (props) => {
	const [expanded, setExpanded] = useState(false);
	const [items, setItems] = useState<any>([]);
	const [isShowHistory, setIsShowHistory] = useState<boolean>(false);
	const [attendanceTimeFrame, setAttendanceTimeFrame] = useState<any[]>(["100000002"]);
	const [extraColumnToDisplay, setextraColumnToDisplay] = useState<IColumn[]>([]);
	const [studentChangedVals, setStudentChangedVals] = useState<any[]>([]); // for bulk update if needed.
	const [selectedIndices, setSelectedIndices] = useState<number[]>([]); //need to use this to highlight selected row
	const toggleExpanded = () => setExpanded(prev => !prev);
	const [loadingState, setLoadingState] = useState<LoadingState>("initial");
	const markAllButtonStyle = markAllButtonStyles();
	const classes = useClasses();
	const baseColumns: IColumn[] = [
		{ key: 'StudentInfo', name: '', fieldName: 'StudentInfo', minWidth: 150, maxWidth: 150, isResizable: true },
		{ key: 'StudentProfile', name: '', fieldName: 'StudentProfile', minWidth: 200, maxWidth: 200, isResizable: true },
		{
			key: 'History',
			name: 'History',
			fieldName: 'History',
			minWidth: 50,
			maxWidth: 70,
			isResizable: true,
			onRenderHeader: (colProps?: IDetailsColumnProps, defaultRender?: IRenderFunction<IDetailsColumnProps>,): JSX.Element | null => (
				<div
					style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
					onClick={isShowHistory ? toggleExpanded : undefined}
				>
					<span>History</span>
					{isShowHistory && (<Button
						size="medium"
						icon={expanded ? <ChevronRightRegular /> : <ChevronDownRegular />}
						onClick={(e) => {
							e.stopPropagation();
							toggleExpanded();
						}}
						title={expanded ? 'Collapse' : 'Expand'}
						aria-label={expanded ? 'Collapse' : 'Expand'}
						className={noBgButtonClass}
					/>)}
				</div>
			)
		},
		{
			key: 'AttendanceRate', name: 'Attendance Rate', fieldName: 'AttendanceRate', minWidth: 50, maxWidth: 50, isResizable: true
		}
	];

	const historyColumn: IColumn[] = [
		{ key: 'HistoryDetail', name: '', fieldName: 'HistoryDetail', minWidth: 150, maxWidth: 150, isResizable: true },
	];

	const handleFieldChange = (key: string, fieldName: string, newValue: string | undefined) => {
		let newState = [...studentChangedVals];
		let thisRecord = newState.find((record: any) => record.key === key && record.fieldName === fieldName);

		for (let index = 0; index < newState.length; index++) {
			const element = newState[index];
			element.changing = false;
		}

		if (thisRecord) {
			thisRecord.value = newValue;	// Update existing record
			thisRecord.changing = true;	// Update existing record
		} else {
			newState.push({ key: key, fieldName: fieldName, value: newValue, changing: true });	// Add new record
		}

		setStudentChangedVals(newState);

		setItems((prev: any) =>
			prev.map((item: any) =>
				item.key === key ? { ...item, [fieldName]: newValue ?? '' } : item
			)
		);
	};

	const columns: IColumn[] = expanded
		? [
			...baseColumns.slice(0, 3),
			...historyColumn,
			...extraColumnToDisplay,
		]
		: [...baseColumns.slice(0, 3), ...extraColumnToDisplay, ...baseColumns.slice(3, 4)];

	//#region Custom Items for each cell
	const onRenderItemColumn = (item?: any, index?: number, column?: IColumn) => {
		// Render custom item for each cell
		if (column?.fieldName !== undefined) {
			if (column?.fieldName === 'StudentInfo') {
				return (
					<Stack enableScopedSelectors horizontal verticalAlign='center' tokens={studentStackTokens} style={{ width: '100%', height: '100%' }}>
						<Stack.Item  >
							<Avatar
								name="Katri Athokas"
								image={{
									src: "https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/KatriAthokas.jpg",
								}} />
						</Stack.Item>
						<Stack.Item>
							{/* {item[column.fieldName as keyof any]} */}
							<div style={{ width: '100%', height: '100%', padding: '1px 0' }}>
								<TextField
									value={item[column.fieldName as keyof any] || ''}
									onChange={(e, newValue) => handleFieldChange(item.key, column.fieldName ?? '', newValue)}
									onFocus={(e) => {
										(e.target as HTMLInputElement).select();
										const cellContainer = (e.target as HTMLElement).closest('.ms-DetailsRow-cell');
										if (cellContainer) {
											cellContainer.classList.add(editingCellOutlineClass);
										}
									}}
									onBlur={(e) => {
										const cellContainer = (e.target as HTMLElement).closest('.ms-DetailsRow-cell');
										if (cellContainer) {
											cellContainer.classList.remove(editingCellOutlineClass);
										}
										const editingVal = e.target.value;
										let stateData = [...studentChangedVals];
										let thisRecord = stateData.find((record: any) => record.value === editingVal && record.changing === true);
										updateRecord(thisRecord);
									}}
									styles={{
										root: {
											minWidth: column.minWidth,
											height: '100%',
											width: '100%',
											padding: '0 1px',
										},
										field: {
											backgroundColor: 'transparent',
											height: '100%',
											padding: '0 4px',
											width: '100%',
										},
										fieldGroup: [
											{
												width: '100%',
												height: '100%',
												border: 'none',
												background: 'transparent',
												outline: 'none',
												"::after": { display: 'none !important' }
											}
										]
									}}
								/>
							</div>
						</Stack.Item>
					</Stack>
				)
			}

			if (column?.fieldName === 'StudentProfile') {
				return (
					<Stack enableScopedSelectors horizontal verticalAlign='center' tokens={studentStackTokens} style={{ width: '100%', height: '100%' }}>
						<Stack.Item >
							<StarRegular />
						</Stack.Item>
						<Stack.Item>
							<CaretUpRegular />
						</Stack.Item>
						<Stack.Item>
							House Name ID1234
						</Stack.Item>
					</Stack>
				)
			}

			if (column?.fieldName === 'History') {
				return (
					<div style={{ width: '100%', height: '100%', padding: '1px 0' }}>
						<Stack enableScopedSelectors horizontalAlign="start" verticalAlign='center' horizontal tokens={innerTableStackTokens}>
							<span >{isShowHistory ? 'Past Week' : 'Today'}</span>
						</Stack>
					</div>
				)
			}

			if (column?.fieldName === 'HistoryDetail') {
				return (
					<div style={{ width: '100%', height: '100%', padding: '1px 0' }}>
						<Stack enableScopedSelectors horizontalAlign="start" verticalAlign='center' horizontal tokens={innerTableStackTokens}>
							{/* <span >{isShowHistory ? 'Past Week' : 'Today'}</span> */}
							<table style={{ width: '100px', borderCollapse: 'collapse' }}>
								<tbody>
									<tr>
										<td style={{ border: 'none' }}>{attendanceTimeFrame.includes("100000002") ? 1 : 'M'}</td>{/*// 100000002 is Lesson, 100000000 is AM, 100000001 is PM*/}
										<td style={{ border: 'none' }}>{attendanceTimeFrame.includes("100000002") ? 1 : 'T'}</td>
										<td style={{ border: 'none' }}>{attendanceTimeFrame.includes("100000002") ? 1 : 'W'}</td>
										<td style={{ border: 'none' }}>{attendanceTimeFrame.includes("100000002") ? 1 : 'T'}</td>
										<td style={{ border: 'none' }}>{attendanceTimeFrame.includes("100000002") ? 1 : 'F'}</td>
									</tr>
									<tr>
										<td style={{ border: 'none' }}><CheckmarkRegular className={classes.icon48} /></td>
										<td style={{ border: 'none' }}><CheckmarkRegular className={classes.icon48} /></td>
										<td style={{ border: 'none' }}><CheckmarkRegular className={classes.icon48} /></td>
										<td style={{ border: 'none' }}></td>
										<td style={{ border: 'none' }}></td>
									</tr>
								</tbody>
							</table>
						</Stack>
					</div>
				);
			}

			for (let index = 0; index < item.attendanceInfo.length; index++) {
				const element = item.attendanceInfo[index];
				if (element.key == column.key && element.isPresent) {
					return (
						<div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2, alignItems: 'center' }}>
							<CheckmarkRegular style={{
								width: '32px',
								height: '32px',
								fill: 'black',
							}} />
						</div>
					);
				}
			}

			if (column.key === item.key) {
				if (item.isPresent) {
					return (
						<div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2, alignItems: 'center' }}>
							<CheckmarkRegular style={{
								width: '32px',
								height: '32px',
								fill: 'black',
							}} />
						</div>
					);
				}
				else return null;
			}

			if (column?.fieldName === 'D' || column?.fieldName === 'E' || column?.fieldName === 'F') {
				return (
					<div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2, alignItems: 'center' }}>
						<CheckmarkRegular style={{
							width: '32px',
							height: '32px',
							fill: 'black',
						}} />
					</div>
				);
			}

			if (column?.fieldName === 'AttendanceRate') {
				return (
					<div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2, alignItems: 'center' }}>
						<AttendanceRateIcon content={'99%'} diameter={40} backgroundColor="#28a745" />

					</div>
				);
			}

			return (
				<div style={{ width: '100%', height: '100%', padding: '1px 0' }}>
					<TextField
						value={item[column.fieldName as keyof any] || ''}
						onChange={(e, newValue) => handleFieldChange(item.key, column.fieldName ?? '', newValue)}
						onFocus={(e) => {
							(e.target as HTMLInputElement).select();
							const cellContainer = (e.target as HTMLElement).closest('.ms-DetailsRow-cell');
							if (cellContainer) {
								cellContainer.classList.add(editingCellOutlineClass);
							}
						}}
						onBlur={(e) => {
							const cellContainer = (e.target as HTMLElement).closest('.ms-DetailsRow-cell');
							if (cellContainer) {
								cellContainer.classList.remove(editingCellOutlineClass);
							}
						}}
						styles={{
							root: {
								minWidth: column.minWidth,
								height: '100%',
								width: '100%',
								padding: '0 1px',
							},
							field: {
								backgroundColor: 'transparent',
								height: '100%',
								padding: '0 4px',
								width: '100%',
							},
							fieldGroup: [
								{
									width: '100%',
									height: '100%',
									border: 'none',
									background: 'transparent',
									outline: 'none',
									"::after": { display: 'none !important' }
								}
							]
						}}
					/>
				</div>
			);
		}
		return item[column?.fieldName ?? ''];
	};
	//#endregion

	//#region Function
	const onButtonClick = () => {
		let data = { "test": "test" };
		setLoadingState("loading");
		// setTimeout(() => setLoadingState("loaded"), 5000);
		var request = new XMLHttpRequest();
		request.open("POST", props.context.parameters.PowerAutomateUrl.raw, true);
		request.setRequestHeader("OData-MaxVersion", "4.0");
		request.setRequestHeader("OData-Version", "4.0");
		request.setRequestHeader("Accept", "application/json");
		request.setRequestHeader("Content-Type", "application/json");
		request.onreadystatechange = function () {
			if (this.readyState === 4) {
				request.onreadystatechange = null;
				switch (this.status) {
					case 200: // Operation success with content returned in response body.
					case 201: // Create success. 
					case 202: // Create success. 
						setLoadingState("loaded");
					case 204: // Operation success with no content returned in response body.
						break;
					default: // All other statuses are unexpected so are treated like errors.
						var error;
						try {
							error = JSON.parse(request.response).error;
						} catch (e) {
							error = new Error("Unexpected Error");
						}
						break;
				}
			}
		};
		request.send(JSON.stringify(data));
	};

	const getSchoolSetting = (attendanceId: any) => {
		return new Promise(function (resolve, reject) {
			const data = { "attendanceId": attendanceId };
			var request = new XMLHttpRequest();
			request.open("POST", getSchoolSettingUrl, true);
			request.setRequestHeader("OData-MaxVersion", "4.0");
			request.setRequestHeader("OData-Version", "4.0");
			request.setRequestHeader("Accept", "application/json");
			request.setRequestHeader("Content-Type", "application/json");
			request.timeout = 20000;
			request.onreadystatechange = function () {
				if (this.readyState === 4) {
					request.onreadystatechange = null;
					switch (this.status) {
						case 200: // Operation success with content returned in response body.
							resolve(request.response);
							break;
						case 201: // Create success. 
						case 202: // Create success.
							break;
						//setLoadingState("loaded");
						case 204: // Operation success with no content returned in response body.
							break;
						default: // All other statuses are unexpected so are treated like errors.
							var error;
							try {
								resolve(request.response);
								console.log(error);
							} catch (e) {
								error = new Error("Unexpected Error");
							}
							break;
					}
				}
			};
			request.send(JSON.stringify(data));
		});
	}

	const getStudentInfo = (attendanceId: any) => {
		return new Promise(function (resolve, reject) {
			const data = { "attendanceId": attendanceId };
			var request = new XMLHttpRequest();
			request.open("POST", getStudentInfoUrl, true);
			request.setRequestHeader("OData-MaxVersion", "4.0");
			request.setRequestHeader("OData-Version", "4.0");
			request.setRequestHeader("Accept", "application/json");
			request.setRequestHeader("Content-Type", "application/json");
			request.timeout = 20000;
			request.onreadystatechange = function () {
				if (this.readyState === 4) {
					request.onreadystatechange = null;
					switch (this.status) {
						case 200: // Operation success with content returned in response body.
							resolve(request.response);
							break;
						case 201: // Create success. 
						case 202: // Create success.
							break;
						//setLoadingState("loaded");
						case 204: // Operation success with no content returned in response body.
							break;
						default: // All other statuses are unexpected so are treated like errors.
							var error;
							try {
								resolve(request.response);
								console.log(error);
							} catch (e) {
								error = new Error("Unexpected Error");
							}
							break;
					}
				}
			};
			request.send(JSON.stringify(data));
		});
	}

	const updateRecord = (data: any) => {
		var request = new XMLHttpRequest();
		request.open("POST", props.context.parameters.PowerAutomateUrl.raw, true);
		request.setRequestHeader("OData-MaxVersion", "4.0");
		request.setRequestHeader("OData-Version", "4.0");
		request.setRequestHeader("Accept", "application/json");
		request.setRequestHeader("Content-Type", "application/json");
		request.onreadystatechange = function () {
			if (this.readyState === 4) {
				request.onreadystatechange = null;
				switch (this.status) {
					case 200: // Operation success with content returned in response body.
					case 201: // Create success. 
					case 202: // Create success.
						break;
					//setLoadingState("loaded");
					case 204: // Operation success with no content returned in response body.
						break;
					default: // All other statuses are unexpected so are treated like errors.
						var error;
						try {
							error = JSON.parse(request.response).error.message
							console.log(error);
						} catch (e) {
							error = new Error("Unexpected Error");
						}
						break;
				}
			}
		};
		request.send(JSON.stringify(data));
	}

	const buttonContent = loadingState === "loading" ? "Loading" : loadingState === "loaded" ? "Loaded" : "Start loading";

	const buttonIcon =
		loadingState === "loading" ? (
			<Spinner size="tiny" />
		) : loadingState === "loaded" ? (
			<CheckmarkFilled />
		) : null;

	const buttonClassName =
		loadingState === "initial" ? undefined : markAllButtonStyle.buttonNonInteractive;

	const onResetButtonClick = () => {
		setLoadingState("initial");
	};

	//#endregion
	const selection = React.useMemo(
		() =>
			new Selection({
				selectionMode: SelectionMode.single,
				onSelectionChanged: () => {
					setSelectedIndices(selection.getSelectedIndices());
				},
			}),
		[]
	);

	const composeData = async () => {
		//aaaaaa
		let sortedRecordIds = props.dataSet.sortedRecordIds;
		const promises = sortedRecordIds.map(recordId => getStudentInfo(recordId));
		const results = await Promise.all(promises);
		return results;
	}

	const composeIntoColumns = (data: any): IColumn[] => {
		const extraColumns: IColumn[] = [];

		const groupedByDate = data.reduce((group: any, record: any) => {
			const date = record.attendanceDate;
			if (!group[date]) {
				group[date] = [];
			}
			group[date].push(record);
			return group;
		}, {});

		const sortedGroupedByDate = Object.keys(groupedByDate)
			.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) // Sort dates in ascending order
			.reduce((acc: any, key: any) => {
				acc[key] = groupedByDate[key];
				return acc;
			}, {});

		for (const key in sortedGroupedByDate) {
			if (sortedGroupedByDate.hasOwnProperty(key)) {
				const value = sortedGroupedByDate[key];
				value.forEach((element: any) => {
					const attendanceDateObj = new Date(element.attendanceDate);
					const weekDayNumber = attendanceDateObj.getDay();
					const weekDayName = weekDayNamesShort[weekDayNumber];
					const attendanceMonthIndexed = attendanceDateObj.getMonth() + 1;
					const attendanceDate = attendanceDateObj.getDate();
					const formattedMonth = attendanceMonthIndexed.toString().padStart(2, '0');
					const formattedattendanceDate = attendanceDate.toString().padStart(2, '0');
					if (isDateInCurrentWeek(new Date(element.attendanceDate)) && (element.timeFrameType === 100000001 || element.timeFrameType === 100000000)) {
						extraColumns.push({
							key: element.key,
							name: '',
							fieldName: '',
							minWidth: 50,
							maxWidth: 100,
							className: blueColumnClass,
							headerClassName: blueHeaderClass,
							isResizable: true,
							onRenderHeader: (colProps?: IDetailsColumnProps, defaultRender?: IRenderFunction<IDetailsColumnProps>): JSX.Element | null => (
								<div
									className={mergeStyles({
										minHeight: '30px',
										height: 'auto',
										padding: '4px 0px',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
										alignItems: 'center',
										overflow: 'visible',
										boxSizing: 'border-box',
									})}
								>
									<span style={{ lineHeight: '1.2', marginTop: -5 }}>{weekDayName}</span>
									<span style={{ lineHeight: '1.2', marginTop: -3 }}>{formattedattendanceDate + "/" + formattedMonth}</span>
									<span style={{ lineHeight: '1.2', marginTop: -2 }}>{element.timeFrameType === 100000001 ? "PM" : "AM"}</span>
								</div>
							)
						});
					}
					else if (isDateInCurrentWeek(new Date(element.attendanceDate)) && (element.timeFrameType !== 100000001 || element.timeFrameType !== 100000000)) {
						extraColumns.push(
							{
								key: element.key,
								name: '',
								fieldName: '',
								minWidth: 50,
								maxWidth: 70,
								isResizable: true,
								className: blueColumnClass,
								headerClassName: blueHeaderClass,
								onRenderHeader: (colProps?: IDetailsColumnProps, defaultRender?: IRenderFunction<IDetailsColumnProps>): JSX.Element | null => (
									<div
										className={mergeStyles({
											minHeight: '30px',
											width: '100%',
											height: 'auto',
											padding: '4px 0px',
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
											alignItems: 'center',
											overflow: 'visible',
											boxSizing: 'border-box',
										})}
									>
										<span style={{ lineHeight: '1.2', marginTop: -5 }}>{weekDayName}</span>
										<span style={{ lineHeight: '1.2', marginTop: -3 }}>{formattedattendanceDate + "/" + formattedMonth}</span>
										<span style={{ lineHeight: '1.2', marginTop: -2 }}></span>
									</div>
								)
							}
						);
					}
				});
			}
		}

		return extraColumns;
	}

	useEffect(() => {
		if (!props.dataSet.loading) {
			async function initDetailList(extraColumns: IColumn[]) {
				// Get school setting
				const schoolSettingJson: any = await getSchoolSetting(props.dataSet.sortedRecordIds[0]);

				if (schoolSettingJson !== "") {
					const schoolSettingResult = JSON.parse(schoolSettingJson);
					const attendanceTimeFrameSetting = schoolSettingResult.attendanceTimeFrame;
					const attendanceTimeFrameArr = attendanceTimeFrameSetting.split(",");
					setAttendanceTimeFrame(attendanceTimeFrameArr);

					setIsShowHistory(schoolSettingResult.isShowHistory === "True" ? true : false);
				}

				setextraColumnToDisplay(extraColumns);
			}

			let items: any = props.dataSet.sortedRecordIds.map((id: string) => {
				const record = props.dataSet.records[id];
				const attendanceDate = record.getValue('tmrw_attendancedate') as Date;
				return {
					key: record.getRecordId(),
					StudentInfo: record.getValue('tmrw_name'),
					attendanceDate: attendanceDate?.toLocaleDateString(),
					isPresent: record.getValue('tmrw_ispresent'),
					timeFrameType: record.getValue('tmrw_timeframetype'),
					E: record.getValue(''),
					F: record.getValue(''),
				};
			});

			const extraColumns = composeIntoColumns(items);

			async function distinctData() {
				debugger;
				const studentInfo = await composeData();
				const studentInfoArrayObj = studentInfo.map((jsonStr: any) => JSON.parse(jsonStr));

				const lookupMap = studentInfoArrayObj.reduce((acc, { attendanceId, studentId }) => {
					acc[attendanceId] = studentId;
					return acc;
				}, {});

				const joinedRecords = items.map((record: any) => ({
					...record,
					studentId: lookupMap[record.key] || null
				}));

				const groupedByStudent = joinedRecords.reduce((acc: any, record: any) => {
					if (!acc[record.studentId]) {
						acc[record.studentId] = [];
					}
					acc[record.studentId].push(record);
					return acc;
				}, {});

				const distinctCombinedOutput = Object.keys(groupedByStudent).map(studentId => {
					const records = groupedByStudent[studentId];
					const { key, StudentInfo, attendanceDate, timeFrameType, E, F, studentId: sId } = records[0];

					return {
						key: sId,
						StudentInfo,
						attendanceDate,
						timeFrameType,
						E,
						F,
						studentId: sId,
						attendanceInfo: records.map((r: any) => ({ key: r.key, isPresent: r.isPresent }))
					};
				});

				setItems(distinctCombinedOutput);
				console.log('');
			}

			initDetailList(extraColumns);
			distinctData();
			//setItems(items);
		}
	}, [props.dataSet.sortedRecordIds]);

	const _onRenderRow: IDetailsListProps['onRenderRow'] = props => {
		if (!props) return null;
		const isSelected = selection.isIndexSelected(props.itemIndex);
		const customStyles: Partial<IDetailsRowStyles> = {
			root: {
				paddingTop: '1px !important',
				paddingBottom: '1px !important',
				selectors: {
					':hover': {
						backgroundColor: '#f2f2f2 !important',
					},
				},
			}
		};

		// if (isSelected) {
		// 	customStyles.root = {
		// 		backgroundColor: 'rgb(235, 243, 252) !important',
		// 		selectors: {
		// 			':hover': {
		// 				backgroundColor: 'rgb(207, 228, 250) !important',
		// 			}
		// 		},
		// 	}
		// 	customStyles.cell = {
		// 		borderRadius: '2px',
		// 	}
		// }

		if (props.itemIndex % 2 === 0) {
			// Every other row renders with a different background color
			customStyles.root = { backgroundColor: theme.palette.neutralLighterAlt };
		}

		return <DetailsRow {...props as IDetailsRowBaseProps}
			styles={customStyles}
			className={isSelected ? selectedRowClass : nonSelectedRowClass}
		/>;
	};
	const stackDetailListItemStyles: IStackItemStyles = {
		root: {
			width: '100%',
			overflowY: 'hidden',
			overflowX: 'hidden'
		},
	};

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<FluentProvider theme={webLightTheme}>
				<Stack enableScopedSelectors verticalFill grow verticalAlign="space-around" tokens={{ childrenGap: 20 }}>
					<Stack enableScopedSelectors horizontalAlign="end" horizontal wrap tokens={wrapStackTokens} style={{ width: '100%' }}>
						<Stack enableScopedSelectors horizontalAlign="end" horizontal wrap tokens={wrapStackTokensInnerButton}>
							<Button
								className={buttonClassName}
								disabledFocusable={loadingState !== "initial"}
								icon={buttonIcon}
								onClick={onButtonClick}>
								Mark All as Present
							</Button>
							<Button>Seating Plan</Button>
							<Button>Class Team</Button>
							<Button>Print List</Button>
							{/* <DefaultButton>Mark All as Present</DefaultButton>
							<DefaultButton>Seating Plan</DefaultButton>
							<DefaultButton>Class Team</DefaultButton>
							<DefaultButton>Print List</DefaultButton> */}
						</Stack>

						<Button>Submit</Button>
					</Stack>
					<Stack styles={stackDetailListItemStyles} >
						<DetailsList
							items={items}
							columns={columns}
							styles={gridStyles}
							//compact={false}
							//constrainMode={ConstrainMode.unconstrained}
							//layoutMode={DetailsListLayoutMode.fixedColumns}
							setKey="set"
							onRenderItemColumn={onRenderItemColumn}
							onRenderRow={_onRenderRow}
							selectionPreservedOnEmptyClick={true}
							checkboxVisibility={CheckboxVisibility.hidden}
							selection={selection}
						/>
					</Stack>
				</Stack>
			</FluentProvider>

		</div>

	);
};

export default ExpandableDetailsList;
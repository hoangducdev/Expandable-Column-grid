import * as React from 'react';
import { useState } from 'react';
import {
	DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn, IDetailsListStyles, CheckboxVisibility,
	IDetailsFooterProps, DetailsRow, ConstrainMode, IDetailsRowStyles, IDetailsColumnProps, IDetailsListProps,
	IDetailsRowBaseProps
} from '@fluentui/react/lib/DetailsList';
import { IconButton } from '@fluentui/react/lib/Button';
import { IRenderFunction } from '@fluentui/react/lib/Utilities';
import { TextField, ITextFieldProps, ITextFieldStyleProps, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { getTheme } from '@fluentui/react/lib/Styling';
import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from '@fluentui/react/lib/Stack';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { FluentProvider, webLightTheme, Button } from '@fluentui/react-components';
import { FontIcon, Icon } from '@fluentui/react/lib/Icon';
export interface IExpandableDetailsListProp {
	context: any;
}
import { SendRegular, CheckmarkRegular } from "@fluentui/react-icons";
import { makeStyles, shorthands } from "@fluentui/react-components";
const theme = getTheme();

const wrapStackTokens: IStackTokens = { childrenGap: 60 };
const innerTableStackTokens: IStackTokens = { childrenGap: 30 };
const wrapStackTokensInnerButton: IStackTokens = { childrenGap: 7 };
const headingStackTokens: IStackTokens = { childrenGap: 30 };
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

const gridStyles: Partial<IDetailsListStyles> = {
	root: {
		overflowX: 'scroll',
		selectors: {
			'& [role=grid]': {
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'start',
				height: '100%',
				width: '100%',
			},
		},
	},
	headerWrapper: {
		flex: '0 0 auto',
	},
	contentWrapper: {
		flex: '1 1 auto',
		// overflow: 'scroll',
		overflowY: 'auto',
	},
};

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

const initialItems = [
	{ key: '1', A: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '2', A: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '3', A: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '4', A: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '5', A: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '6', A: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '7', A: 'Item 2-A', B: 'Item 2-B', C: 'Item 2-C', D: 'Item 2-D', E: 'Item 2-E', F: 'Item 2-F' },
];

const ExpandableDetailsList: React.FunctionComponent<IExpandableDetailsListProp> = (props) => {
	const [expanded, setExpanded] = useState(false);
	const [items, setItems] = useState<any>(initialItems);
	const [selectedIndices, setSelectedIndices] = useState<number[]>([]); //need to use this to highlight selected row
	const toggleExpanded = () => setExpanded(prev => !prev);
	const classes = useClasses();
	const baseColumns: IColumn[] = [
		{ key: 'A', name: 'A', fieldName: 'A', minWidth: 50, maxWidth: 100, isResizable: true },
		{ key: 'B', name: 'B', fieldName: 'B', minWidth: 50, maxWidth: 100, isResizable: true },
		{
			key: 'C',
			name: 'HISTORY',
			fieldName: 'C',
			minWidth: 100,
			maxWidth: 200,
			isResizable: true,
			onRenderHeader: (colProps?: IDetailsColumnProps, defaultRender?: IRenderFunction<IDetailsColumnProps>,): JSX.Element | null => (
				<div
					style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
					onClick={toggleExpanded}
				>
					<span>HISTORY</span>
					<IconButton
						iconProps={{ iconName: expanded ? 'ChevronRight' : 'ChevronDown' }}
						title={expanded ? 'Collapse' : 'Expand'}
						ariaLabel={expanded ? 'Collapse' : 'Expand'}
						onClick={(e) => {
							e.stopPropagation();
							toggleExpanded();
						}}
					/>
				</div>
			)
		}
	];
	const stackStyles: IStackStyles = {
		root: {
			height: '42px',
			width: '100%',
		},
	};

	const greenColumnClass = mergeStyles({
		// Nhắm đúng ô (cell) của cột F
		selectors: {
			"&.ms-DetailsRow-cell": {
				position: "relative",
				// Giữ cho cell trong suốt, để nhìn thấy màu row bên dưới
				backgroundColor: "transparent !important",

				// Tạo overlay bằng pseudo-element
				"::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "rgba(0, 128, 0, 0.06)", // màu xanh lá nhạt 20% alpha
					pointerEvents: "none", // không cản trở tương tác
					zIndex: 1,            // nằm trên nền cell, dưới nội dung
				},
			},
		},
	});

	const blueColumnClass = mergeStyles({
		position: "relative",
		backgroundColor: "transparent !important",
		"::before": {
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
	});

	// Nếu muốn header cũng có màu tương ứng:
	const greenHeaderClass = mergeStyles({
		position: "relative",
		backgroundColor: "transparent !important",
		"::before": {
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
			  position: "relative",
			  zIndex: 2,
			},
		  },
	});

	const blueHeaderClass = mergeStyles({
		position: "relative",
		backgroundColor: "transparent !important",
		"::before": {
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
			  position: "relative",
			  zIndex: 2,
			},
		  },
	});

	const extraColumns: IColumn[] = [
		{
			key: 'D', name: 'Line1\nLine2\nLine3', fieldName: 'D', minWidth: 50, maxWidth: 100, isResizable: true,
			onRenderHeader: (colProps?: IDetailsColumnProps, defaultRender?: IRenderFunction<IDetailsColumnProps>,): JSX.Element | null => (
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
					<span style={{ lineHeight: '1.2', marginTop: -5 }}>MON</span>
					<span style={{ lineHeight: '1.2', marginTop: -3 }}>03/02</span>
					<span style={{ lineHeight: '1.2', marginTop: -2 }}>P1</span>
				</div>
			)
		},
		{
			key: 'E', name: 'E', fieldName: 'E', minWidth: 50, maxWidth: 100, isResizable: true,
			onRenderHeader: (colProps?: IDetailsColumnProps, defaultRender?: IRenderFunction<IDetailsColumnProps>,): JSX.Element | null => (
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
					<span style={{ lineHeight: '1.2', marginTop: -5 }}>MON</span>
					<span style={{ lineHeight: '1.2', marginTop: -3 }}>03/02</span>
					<span style={{ lineHeight: '1.2', marginTop: -2 }}>P2</span>
				</div>
			)
		},
		{
			key: 'F', name: 'F', fieldName: 'F', minWidth: 50, maxWidth: 100, isResizable: true,
			className: greenColumnClass,       // Cells cột F
			headerClassName: greenHeaderClass, // Header cột F
			onRenderHeader: (colProps?: IDetailsColumnProps, defaultRender?: IRenderFunction<IDetailsColumnProps>,): JSX.Element | null => (
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
					<span style={{ lineHeight: '1.2', marginTop: -5 }}>MON</span>
					<span style={{ lineHeight: '1.2', marginTop: -3 }}>03/02</span>
					<span style={{ lineHeight: '1.2', marginTop: -2 }}>P3</span>
				</div>
			)
		}
		,
		{
			key: 'G', name: 'G', fieldName: 'G', minWidth: 50, maxWidth: 100, isResizable: true,
			className: blueColumnClass,       // Cells cột F
			headerClassName: blueHeaderClass, // Header cột F
			onRenderHeader: (colProps?: IDetailsColumnProps, defaultRender?: IRenderFunction<IDetailsColumnProps>,): JSX.Element | null => (
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
					<span style={{ lineHeight: '1.2', marginTop: -5 }}>MON</span>
					<span style={{ lineHeight: '1.2', marginTop: -3 }}>03/02</span>
					<span style={{ lineHeight: '1.2', marginTop: -2 }}>P4</span>
				</div>
			)
		},
		{
			key: 'H', name: 'H', fieldName: 'H', minWidth: 50, maxWidth: 100, isResizable: true,
			onRenderHeader: (colProps?: IDetailsColumnProps, defaultRender?: IRenderFunction<IDetailsColumnProps>,): JSX.Element | null => (
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
					<span style={{ lineHeight: '1.2', marginTop: -5 }}>MON</span>
					<span style={{ lineHeight: '1.2', marginTop: -3 }}>03/02</span>
					<span style={{ lineHeight: '1.2', marginTop: -2 }}>P5</span>
				</div>
			)
		}
	];

	const handleFieldChange = (key: string, fieldName: string, newValue: string | undefined) => {
		setItems((prev: any) =>
			prev.map((item: any) =>
				item.key === key ? { ...item, [fieldName]: newValue ?? '' } : item
			)
		);
	};

	const columns: IColumn[] = expanded ? [...baseColumns, ...extraColumns] : baseColumns;

	const onRenderItemColumn = (item?: any, index?: number, column?: IColumn) => {
		if (column?.fieldName !== undefined) {
			if (column?.fieldName === 'C') {
				return (
					<div style={{ width: '100%', height: '100%', padding: '1px 0' }}>
						<Stack enableScopedSelectors horizontalAlign="start" horizontal tokens={innerTableStackTokens}>
							<span >Today</span>
							<table style={{ width: '100px', borderCollapse: 'collapse' }}>
								<tbody>
									<tr>
										<td style={{ border: 'none' }}>1</td>
										<td style={{ border: 'none' }}>2</td>
										<td style={{ border: 'none' }}>3</td>
										<td style={{ border: 'none' }}>4</td>
										<td style={{ border: 'none' }}>5</td>
									</tr>
									<tr>
										<td style={{ border: 'none' }}><CheckmarkRegular className={classes.icon48} /></td>
										<td style={{ border: 'none' }}><CheckmarkRegular className={classes.icon48} /></td>
										<td style={{ border: 'none' }}><CheckmarkRegular className={classes.icon48} /></td>
										<td style={{ border: 'none' }}>4</td>
										<td style={{ border: 'none' }}>5</td>
									</tr>
								</tbody>
							</table>
						</Stack>
					</div>
				);
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

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<FluentProvider theme={webLightTheme}>
				<Stack enableScopedSelectors verticalAlign="space-around" >
					<Stack enableScopedSelectors horizontalAlign="end" horizontal wrap tokens={wrapStackTokens}>
						<Stack enableScopedSelectors horizontalAlign="end" horizontal wrap tokens={wrapStackTokensInnerButton}>

							<DefaultButton text="Mark All as Present" allowDisabledFocus />
							<DefaultButton text="Seating Plan" allowDisabledFocus />
							<DefaultButton text="Class Team" allowDisabledFocus />
							<DefaultButton text="Print List" allowDisabledFocus />
						</Stack>

						<DefaultButton text="Submit" allowDisabledFocus />
					</Stack>
					<Stack>
						<DetailsList
							items={items}
							columns={columns}
							//styles={gridStyles}
							//constrainMode={ConstrainMode.unconstrained}
							//layoutMode={DetailsListLayoutMode.fixedColumns}
							setKey="set"
							onRenderItemColumn={onRenderItemColumn}
							onRenderRow={_onRenderRow}
							selectionPreservedOnEmptyClick={true}

							selection={selection}
						/>
					</Stack>
				</Stack>
			</FluentProvider>

		</div>

	);
};

export default ExpandableDetailsList;
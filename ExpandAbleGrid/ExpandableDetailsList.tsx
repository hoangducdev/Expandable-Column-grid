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

export interface IExpandableDetailsListProp {
	context: any;
}

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

	const baseColumns: IColumn[] = [
		{ key: 'A', name: 'A', fieldName: 'A', minWidth: 50, maxWidth: 100, isResizable: true },
		{ key: 'B', name: 'B', fieldName: 'B', minWidth: 50, maxWidth: 100, isResizable: true },
		{
			key: 'C',
			name: 'HISTORY',
			fieldName: 'C',
			minWidth: 50,
			maxWidth: 100,
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

	const extraColumns: IColumn[] = [
		{ key: 'D', name: 'D', fieldName: 'D', minWidth: 50, maxWidth: 100, isResizable: true },
		{ key: 'E', name: 'E', fieldName: 'E', minWidth: 50, maxWidth: 100, isResizable: true },
		{ key: 'F', name: 'F', fieldName: 'F', minWidth: 50, maxWidth: 100, isResizable: true }
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

		if (isSelected) {
			customStyles.root = {
				backgroundColor: 'rgb(235, 243, 252) !important',
				selectors: {
					':hover': {
						backgroundColor: 'rgb(207, 228, 250) !important',
					}
				},
			}
			customStyles.cell = {
				borderRadius: '2px',
			}
		}

		return <DetailsRow {...props as IDetailsRowBaseProps}
			styles={customStyles}
			className={isSelected ? selectedRowClass : nonSelectedRowClass}
		/>;
	};

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<DetailsList
				items={items}
				columns={columns}
				setKey="set"
				onRenderItemColumn={onRenderItemColumn}
				onRenderRow={_onRenderRow}
				selectionPreservedOnEmptyClick={true}
				selection={selection}
			/>
		</div>

	);
};

export default ExpandableDetailsList;

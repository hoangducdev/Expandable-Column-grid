import * as React from 'react';
import { useState } from 'react';
import {
	DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn, IDetailsListStyles, CheckboxVisibility,
	IDetailsFooterProps, DetailsRow, ConstrainMode, IDetailsRowStyles, IDetailsColumnProps
} from '@fluentui/react/lib/DetailsList';
import { IconButton } from '@fluentui/react/lib/Button';
import { IRenderFunction } from '@fluentui/react/lib/Utilities';
import { TextField, ITextFieldProps, ITextFieldStyleProps, ITextFieldStyles } from '@fluentui/react/lib/TextField';

export interface IExpandableDetailsListProp {
	context: any;
}

// Sample data items.
const initialItems = [
	{ key: '1', A: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '2', A: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '3', A: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '4', A: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '5', A: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '6', A: 'Student Name', B: 'House Name ID1234', C: 'Today', D: 'Item 1-D', E: 'Item 1-E', F: 'Item 1-F' },
	{ key: '7', A: 'Item 2-A', B: 'Item 2-B', C: 'Item 2-C', D: 'Item 2-D', E: 'Item 2-E', F: 'Item 2-F' },
	// Add more items as needed.
];
const ExpandableDetailsList: React.FunctionComponent<IExpandableDetailsListProp> = (props) => {
	// State to track whether the extra columns are shown.
	const [expanded, setExpanded] = useState(false);
	const [items, setItems] = useState<any>(initialItems);
	const toggleExpanded = () => setExpanded(prev => !prev);

	// Define the base three columns (A, B, and C).
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
			// Render a custom cell that includes a toggle icon.
			onRenderHeader: (colProps?: IDetailsColumnProps,
				defaultRender?: IRenderFunction<IDetailsColumnProps>,): JSX.Element | null => (
				<div
					style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
					// Clicking anywhere in the cell toggles the expanded state.
					onClick={toggleExpanded}
				>
					<span>HISTORY</span>
					<IconButton
						iconProps={{ iconName: expanded ? 'ChevronRight' : 'ChevronDown' }}
						title={expanded ? 'Collapse' : 'Expand'}
						ariaLabel={expanded ? 'Collapse' : 'Expand'}
						// Stop propagation so clicking the icon doesn’t fire duplicate events.
						onClick={(e) => {
							e.stopPropagation();
							toggleExpanded();
						}}
					/>
				</div>
			),
			// onRender: (item) => {
			// 	<div
			// 		style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
			// 		// Clicking anywhere in the cell toggles the expanded state.
			// 		onClick={toggleExpanded}
			// 	>
			// 		<span style={{ marginRight: 8 }}>{item.C}</span>
			// 		<IconButton
			// 			iconProps={{ iconName: expanded ? 'ChevronDown' : 'ChevronRight' }}
			// 			title={expanded ? 'Collapse' : 'Expand'}
			// 			ariaLabel={expanded ? 'Collapse' : 'Expand'}
			// 			// Stop propagation so clicking the icon doesn’t fire duplicate events.
			// 			onClick={(e) => { e.stopPropagation(); toggleExpanded(); }}
			// 		/>
			// 	</div>
			// }
		}
	];

	// Define the extra columns that are only shown when expanded.
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

	// Choose columns based on the expanded state.
	const columns: IColumn[] = expanded ? [...baseColumns, ...extraColumns] : baseColumns;

	const onRenderItemColumn = (item?: any, index?: number, column?: IColumn) => {
		// For editable cells, render a TextField if the row is in edit mode.
		if (column?.fieldName !== undefined) {
			return (
				<TextField
					value={item[column.fieldName as keyof any] || ''}
					onChange={(e, newValue) => handleFieldChange(item.key, column.fieldName ?? '', newValue)}
					styles={{
						root: {
							// Optionally remove any root-level spacing or add your own styling here
						},
						fieldGroup: [
							{
								width: column.maxWidth,
								border: 'none',
								background: 'transparent' 
							}
						]
					}}
				/>
			);
		}
		// Otherwise, render plain text.
		return item[column?.fieldName ?? ''];
	};
	return (
		<DetailsList
			items={items}
			columns={columns}
			setKey="set"
			onRenderItemColumn={onRenderItemColumn}
			//layoutMode={DetailsListLayoutMode.fixedColumns}
			selectionPreservedOnEmptyClick={true}
		/>
	);
};

// function getStyles(props: ITextFieldStyleProps): Partial<ITextFieldStyles> {
// 	const { required } = props;
// 	return {
// 		fieldGroup: [
// 			{ width: columnMinWidth },
// 			required && {
// 				borderTopColor: props.theme.semanticColors.errorText,
// 			},
// 		]
// 	};
// }

export default ExpandableDetailsList;

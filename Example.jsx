// import {List, ListRowProps} from 'react-virtualized';
// // const ELEMENTS: Array<{type: 'low' | 'medium' | 'high', name: string}> = [
// //     {type: 'low', name: 'Misha'},
// //     {type: 'medium', name: 'Kolya'},
// //     {type: 'high', name: 'Alina'},
// //     {type: 'high', name: 'MarkII'},
// //     {type: 'high', name: 'Archy'}
// // ];
// const getHeightByType = (type: 'low' | 'medium' | 'high') => {
//     switch (type) {
//         case 'low':
//             return 22;
//         case 'medium':
//             return 42;
//         case 'high':
//             return 62;
//     }
// };
// export const ListExample = () => {
//     return (
//         <List
//             height={500}
//             width={600}
//             rowCount={ELEMENTS.length}
//             rowHeight={idx => getHeightByType(ELEMENTS[idx.index].type)}
//             rowRenderer={(props: ListRowProps) => {
//                 return (
//                     <div id={props.key} style={{...props.style, border: '1px solid green', height: 100}}>
//                         {' '}
//                         {props.key}{' '}
//                     </div>
//                 );
//             }}
//         />
//     );
// };


// // import React from 'react';
// // import {useNavigate} from 'react-router-dom';

// // import {List, ListRowProps} from 'react-virtualized';
// // import {Task} from './Task';

// // export const Tasks = ({searchedTasks, onEdit, onView, onRemove, onClone, currentTaskId}) => {
// //     const navigate = useNavigate();



// //     return (
// //         <>
// //             {searchedTasks.map(task => {
// //                 const taskDate = new Date(task.date.split('.').reverse().join('-'));
// //                 const currentDate = new Date();
// //                 const isPastDue = taskDate < currentDate && task.status !== 'Done';

// //                 return (
// //                     <List
// //                         width={300}
// //                         height={300}
// //                         rowCount={searchedTasks.length}
// //                         rowHeight={20}
// //                         rowRenderer={() => {
// //                             return (
// //                                 <div key={key} style={{...props.style, style}}>
// //                                     {searchedTasks[index]}
// //                                     <Task
// //                                         isPastDue={isPastDue}
// //                                         task={task}
// //                                         onEdit={onEdit}
// //                                         onView={onView}
// //                                         onRemove={onRemove}
// //                                         onClone={onClone}
// //                                         currentTaskId={currentTaskId}
// //                                         key={task.id}
// //                                     />
// //                                 </div>
// //                             );
// //                         }}
// //                     />
// //                 );
// //             })}
// //         </>
// //     );
// // };

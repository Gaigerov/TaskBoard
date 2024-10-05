/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 164:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(540);
// EXTERNAL MODULE: ./node_modules/react-dom/client.js
var client = __webpack_require__(338);
// EXTERNAL MODULE: ./node_modules/react-router-dom/dist/index.js
var dist = __webpack_require__(976);
;// CONCATENATED MODULE: ./src/GlobalStoreContext.jsx

const GlobalStoreContext = /*#__PURE__*/(0,react.createContext)();
const storedTasks = localStorage.getItem('tasks');
const tasks = storedTasks ? JSON.parse(storedTasks) : [];
const GlobalStoreController = _ref => {
  let {
    children
  } = _ref;
  const [state, setState] = (0,react.useState)({
    tasks: tasks,
    isDirty: false,
    currentTaskId: null,
    id: Date.now(),
    title: '',
    description: '',
    date: '',
    errors: {
      title: '',
      description: '',
      date: ''
    }
  });
  return /*#__PURE__*/react.createElement(GlobalStoreContext.Provider, {
    value: {
      state,
      setState
    }
  }, children);
};
const useGlobalStore = () => {
  const {
    state
  } = (0,react.useContext)(GlobalStoreContext);
  return state;
};
const useSetGlobalStore = () => {
  const {
    setState
  } = (0,react.useContext)(GlobalStoreContext);
  const handleSetState = newState => {
    setState(state => {
      return {
        ...state,
        ...newState
      };
    });
  };
  return handleSetState;
};
// EXTERNAL MODULE: ./node_modules/react-router/dist/index.js
var react_router_dist = __webpack_require__(767);
;// CONCATENATED MODULE: ./src/ErrorPage.jsx


const ErrorPage = () => {
  const error = (0,react_router_dist/* useRouteError */.r5)();
  console.error(error);
  return /*#__PURE__*/react.createElement("div", {
    id: "error-page",
    className: "errorPage"
  }, /*#__PURE__*/react.createElement("h1", null, "Oops!"), /*#__PURE__*/react.createElement("p", null, "Sorry, an unexpected error has occurred."), /*#__PURE__*/react.createElement("p", null, /*#__PURE__*/react.createElement("i", null, error.statusText || error.message)));
};
;// CONCATENATED MODULE: ./src/Task.jsx




const editButton = __webpack_require__(422);
const deleteButton = __webpack_require__(603);
const cloneButton = __webpack_require__(350);
const Task = _ref => {
  let {
    task,
    onEdit,
    onView,
    onDelete,
    onClone
  } = _ref;
  const {
    currentTaskId
  } = useGlobalStore();
  const navigate = (0,react_router_dist/* useNavigate */.Zp)();
  const url = new URL("http://localhost:3000");
  const params = new URLSearchParams(url.search);
  params.set("id", task.id);
  params.toString();
  return /*#__PURE__*/react.createElement("div", {
    className: "btn taskContainer",
    onClick: onView,
    style: {
      backgroundColor: currentTaskId === task.id ? 'var(--light-grey)' : '' // Изменяем цвет фона
    }
  }, /*#__PURE__*/react.createElement("div", {
    className: "taskContent",
    onClick: () => navigate(`view?${params}`)
  }, /*#__PURE__*/react.createElement("h3", {
    className: "taskName"
  }, task.title), /*#__PURE__*/react.createElement("p", {
    className: "taskDescription"
  }, task.description), /*#__PURE__*/react.createElement("span", {
    className: "controls",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/react.createElement("span", {
    className: "controlsContainer"
  }, /*#__PURE__*/react.createElement(dist/* Link */.N_, {
    to: `edit?${params}`,
    onClick: onEdit
  }, /*#__PURE__*/react.createElement("img", {
    className: "editButton",
    src: editButton
  })), /*#__PURE__*/react.createElement(dist/* Link */.N_, {
    onClick: () => {
      onClone(task.id);
    }
  }, /*#__PURE__*/react.createElement("img", {
    className: "cloneButton",
    src: cloneButton
  })), /*#__PURE__*/react.createElement(dist/* Link */.N_, {
    to: `remove?${params}`,
    onClick: () => {
      onDelete(task.id);
    }
  }, /*#__PURE__*/react.createElement("img", {
    className: "deleteButton",
    src: deleteButton
  })))), /*#__PURE__*/react.createElement("p", {
    className: "taskDate"
  }, task.date)));
};
// EXTERNAL MODULE: ./node_modules/@fortawesome/react-fontawesome/index.es.js + 1 modules
var index_es = __webpack_require__(601);
// EXTERNAL MODULE: ./node_modules/@fortawesome/free-solid-svg-icons/index.mjs
var free_solid_svg_icons = __webpack_require__(188);
;// CONCATENATED MODULE: ./src/Modal.jsx






const Modal = _ref => {
  let {
    onClose,
    onEdit,
    task,
    mode,
    onCreate,
    onSave,
    onRemove,
    onClone
  } = _ref;
  const {
    title,
    description,
    date,
    errors,
    isDirty
  } = useGlobalStore();
  const setGlobalStore = useSetGlobalStore();
  const modalRef = (0,react.useRef)(null);
  const validate = () => {
    let newErrors = {
      title: '',
      description: '',
      date: ''
    };
    let isValid = true;

    // Валидация title
    if (!title) {
      newErrors.title = 'Enter the title';
      isValid = false;
    } else if (title.length > 50) {
      newErrors.title = 'Maximum of 50 characters';
      isValid = false;
    }

    // Валидация description
    if (!description) {
      newErrors.description = 'Enter a description';
      isValid = false;
    } else if (description.length > 200) {
      newErrors.description = 'Maximum of 200 characters';
      isValid = false;
    }

    // Валидация date
    if (!date) {
      newErrors.date = 'Enter the date';
      isValid = false;
    } else {
      const today = new Date();
      const inputDate = new Date(date.split('.').reverse().join('-')); // Преобразуем DD.MM.YYYY в YYYY-MM-DD

      if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
        newErrors.date = 'Enter a valid date';
        isValid = false;
      } else if (inputDate < today) {
        newErrors.date = 'Enter the date that has not passed yet';
        isValid = false;
      }
    }
    setGlobalStore({
      errors: newErrors
    });
    return isValid;
  };
  (0,react.useEffect)(() => {
    if (mode === 'create' && isDirty === true) {
      isValid = true;
      validate();
    }
  }, [title, description, date]);
  const handleClickOutside = event => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
      setGlobalStore({
        title: '',
        description: '',
        date: ''
      });
    }
    ;
  };
  const handleAction = () => {
    if (mode === 'create' && validate()) {
      onCreate({
        title,
        description,
        date
      });
      setGlobalStore({
        title: '',
        description: '',
        date: ''
      });
    } else if (mode === 'edit' && validate()) {
      onSave({
        ...task,
        title,
        description,
        date
      });
      onClose();
      setGlobalStore({
        title: '',
        description: '',
        date: ''
      });
    }
  };
  const handleKeyDown = event => {
    if (event.key === 'Escape') {
      onClose();
      setGlobalStore({
        title: '',
        description: '',
        date: ''
      });
    }
  };
  const handleClose = event => {
    event.preventDefault();
    onClose();
    setGlobalStore({
      title: '',
      description: '',
      date: ''
    });
  };
  const handleRemoveTask = event => {
    event.preventDefault();
    onRemove(task.id);
    onClose();
    setGlobalStore({
      title: '',
      description: '',
      date: ''
    });
  };
  const handleCloneTask = () => {
    onClone(task.id);
    onClose();
  };
  (0,react.useEffect)(() => {
    if (mode) {
      document.addEventListener('keydown', handleKeyDown);
    }
    if (mode === 'view') {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode]);
  (0,react.useEffect)(() => {
    if (mode === 'edit') {
      onSave;
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onEdit]);
  (0,react.useEffect)(() => {
    if (task) {
      setGlobalStore({
        title: task.title,
        description: task.description,
        date: task.date
      });
    }
  }, [task]);
  const clearFirstFields = () => {
    setGlobalStore({
      title: ''
    });
  };
  const clearSecondFields = () => {
    setGlobalStore({
      description: ''
    });
  };
  const clearThirdFields = () => {
    setGlobalStore({
      date: ''
    });
  };
  if (!mode) return null;
  return /*#__PURE__*/react.createElement("div", {
    className: "modalOverlay"
  }, /*#__PURE__*/react.createElement("div", {
    className: mode === 'remove' ? "modalRemoveContent" : "modalContent",
    ref: modalRef
  }, mode === 'remove' ? /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    className: "modalHeader"
  }, /*#__PURE__*/react.createElement("h2", {
    className: "modalHeaderName"
  }, "Remove Task"), /*#__PURE__*/react.createElement(index_es/* FontAwesomeIcon */.g, {
    className: "modalCloseButton",
    onClick: handleClose,
    icon: free_solid_svg_icons/* faXmark */.Jyw
  })), /*#__PURE__*/react.createElement("div", {
    className: "modalModeText"
  }, /*#__PURE__*/react.createElement("p", {
    className: "modalRemoveParagraph"
  }, "Are you sure you want to delete the task \"", /*#__PURE__*/react.createElement("span", {
    className: "modalBoldText"
  }, task.title), "\"?")), /*#__PURE__*/react.createElement("div", {
    className: "modalButtons"
  }, /*#__PURE__*/react.createElement("button", {
    className: "btn modalRemoveButton",
    onClick: handleRemoveTask
  }, "Remove"), /*#__PURE__*/react.createElement("button", {
    className: "btn modalCancelButton",
    onClick: handleClose
  }, "Cancel"))) : /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    className: "modalHeader"
  }, /*#__PURE__*/react.createElement("h2", {
    className: "modalHeaderName"
  }, mode === 'view' ? task.title : mode === 'edit' ? 'Edit Task' : 'Create Task'), /*#__PURE__*/react.createElement(index_es/* FontAwesomeIcon */.g, {
    className: "modalCloseButton",
    onClick: handleClose,
    icon: free_solid_svg_icons/* faXmark */.Jyw
  }))), mode === 'view' && /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("div", {
    className: "modalModeText"
  }, /*#__PURE__*/react.createElement("p", {
    className: "modalModeText__description"
  }, task.description), /*#__PURE__*/react.createElement("p", {
    className: "modalModeText__date"
  }, task.date)), /*#__PURE__*/react.createElement("div", {
    className: "modalButtons"
  }, /*#__PURE__*/react.createElement(dist/* Link */.N_, {
    to: `/edit?id=${task.id}`,
    className: "btn modalEditfromViewButton",
    onClick: () => onEdit(task)
  }, "Edit"), /*#__PURE__*/react.createElement("button", {
    className: "btn modalCloneButton",
    onClick: handleCloneTask
  }, "Copy"), /*#__PURE__*/react.createElement("button", {
    className: "btn modalCancelButton",
    onClick: handleClose
  }, "Cancel"))), mode === 'edit' && /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("label", null, "Title", /*#__PURE__*/react.createElement("div", {
    className: "inputContainer"
  }, /*#__PURE__*/react.createElement("input", {
    type: "text",
    name: "title",
    className: "modalInput",
    value: title,
    onChange: event => setGlobalStore({
      title: event.target.value
    }),
    placeholder: "Enter title",
    style: {
      borderColor: errors.title ? 'var(--danger)' : 'var(--light-grey)'
    }
  }), /*#__PURE__*/react.createElement(index_es/* FontAwesomeIcon */.g, {
    className: "inputClearButton",
    onClick: clearFirstFields,
    icon: free_solid_svg_icons/* faXmark */.Jyw
  })), errors.title && /*#__PURE__*/react.createElement("span", {
    style: {
      color: 'red'
    }
  }, errors.title)), /*#__PURE__*/react.createElement("label", null, "Description", /*#__PURE__*/react.createElement("div", {
    className: "inputContainer"
  }, /*#__PURE__*/react.createElement("input", {
    type: "text",
    name: "description",
    className: "modalInput",
    value: description,
    onChange: event => setGlobalStore({
      description: event.target.value
    }),
    placeholder: "Enter description",
    style: {
      borderColor: errors.description ? 'var(--danger)' : 'var(--light-grey)'
    }
  }), /*#__PURE__*/react.createElement(index_es/* FontAwesomeIcon */.g, {
    className: "inputClearButton",
    onClick: clearSecondFields,
    icon: free_solid_svg_icons/* faXmark */.Jyw
  })), errors.description && /*#__PURE__*/react.createElement("span", {
    style: {
      color: 'red'
    }
  }, errors.description)), /*#__PURE__*/react.createElement("label", null, "Date", /*#__PURE__*/react.createElement("div", {
    className: "inputContainer"
  }, /*#__PURE__*/react.createElement("input", {
    type: "text",
    name: "date",
    className: "modalInput",
    value: date,
    onChange: event => setGlobalStore({
      date: event.target.value
    }),
    placeholder: "DD.MM.YYYY",
    style: {
      borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)'
    }
  }), /*#__PURE__*/react.createElement(index_es/* FontAwesomeIcon */.g, {
    className: "inputClearButton",
    onClick: clearThirdFields,
    icon: free_solid_svg_icons/* faXmark */.Jyw
  })), errors.date && /*#__PURE__*/react.createElement("span", {
    style: {
      color: 'red'
    }
  }, errors.date)), /*#__PURE__*/react.createElement("div", {
    className: "modalButtons"
  }, /*#__PURE__*/react.createElement("button", {
    className: "btn modalEditButton",
    onClick: handleAction
  }, "Save"), /*#__PURE__*/react.createElement("button", {
    className: "btn modalCancelButton",
    onClick: handleClose
  }, "Cancel"))), mode === 'create' && /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement("label", null, "Title", /*#__PURE__*/react.createElement("div", {
    className: "inputContainer"
  }, /*#__PURE__*/react.createElement("input", {
    type: "text",
    className: "modalInput",
    value: title,
    onChange: event => setGlobalStore({
      title: event.target.value
    }),
    placeholder: "Enter title",
    style: {
      borderColor: errors.title ? 'var(--danger)' : 'var(--light-grey)'
    }
  })), errors.title && /*#__PURE__*/react.createElement("span", {
    style: {
      color: 'red'
    }
  }, errors.title)), /*#__PURE__*/react.createElement("label", null, "Description", /*#__PURE__*/react.createElement("div", {
    className: "inputContainer"
  }, /*#__PURE__*/react.createElement("input", {
    className: "modalInput",
    value: description,
    onChange: event => setGlobalStore({
      description: event.target.value
    }),
    placeholder: "Enter description",
    style: {
      borderColor: errors.description ? 'var(--danger)' : 'var(--light-grey)'
    }
  })), errors.description && /*#__PURE__*/react.createElement("span", {
    style: {
      color: 'red'
    }
  }, errors.description)), /*#__PURE__*/react.createElement("label", null, "Date", /*#__PURE__*/react.createElement("div", {
    className: "inputContainer"
  }, /*#__PURE__*/react.createElement("input", {
    type: "text",
    className: "modalInput",
    value: date,
    onChange: event => setGlobalStore({
      date: event.target.value
    }),
    placeholder: "DD.MM.YYYY",
    style: {
      borderColor: errors.date ? 'var(--danger)' : 'var(--light-grey)'
    }
  })), errors.date && /*#__PURE__*/react.createElement("span", {
    style: {
      color: 'red'
    }
  }, errors.date)), /*#__PURE__*/react.createElement("div", {
    className: "modalButtons"
  }, /*#__PURE__*/react.createElement("button", {
    className: "btn modalCreateButton",
    onClick: handleAction
  }, "Create"), /*#__PURE__*/react.createElement("button", {
    className: "btn modalCancelButton",
    onClick: handleClose
  }, "Cancel")))));
};
;// CONCATENATED MODULE: ./src/TaskBoard.jsx







const plus = __webpack_require__(374);
const TaskBoard = () => {
  const setGlobalStore = useSetGlobalStore();
  const state = useGlobalStore();
  const {
    tasks,
    currentTaskId
  } = state;
  const {
    mode
  } = (0,react_router_dist/* useParams */.g)();
  const navigate = (0,react_router_dist/* useNavigate */.Zp)();
  const closeModal = () => {
    setGlobalStore({
      currentTaskId: null
    });
    navigate('/');
  };
  const handleCreateTask = newTask => {
    const taskWithId = {
      ...newTask,
      id: Date.now()
    }; // Генерация уникального ID
    const updatedTasks = [...tasks, taskWithId];
    setGlobalStore({
      tasks: updatedTasks
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    closeModal();
  };
  const cloneTask = id => {
    const taskToClone = tasks.find(task => task.id === id);
    if (taskToClone) {
      const newTask = {
        ...taskToClone,
        id: Date.now()
      };
      const updatedTasks = [...tasks, newTask];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setGlobalStore({
        tasks: [...tasks, newTask]
      });
    }
    ;
  };
  const handleEditTask = updatedTask => {
    const updatedTasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setGlobalStore({
      tasks: updatedTasks
    });
    closeModal();
  };
  const handleDeleteTask = id => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setGlobalStore({
      tasks: updatedTasks
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    closeModal();
  };
  const openCreateModal = () => {
    setGlobalStore({
      currentTaskId: null
    });
    navigate('/create');
  };
  const openEditModal = task => {
    setGlobalStore({
      currentTaskId: task.id
    });
    navigate(`/edit/${task.id}`);
  };
  const openViewModal = task => {
    setGlobalStore({
      currentTaskId: task.id
    });
  };
  const openRemoveModal = task => {
    setGlobalStore({
      currentTaskId: task.id
    });
    navigate(`/remove/${task.id}`);
  };
  return /*#__PURE__*/react.createElement("div", {
    className: "taskBoard"
  }, /*#__PURE__*/react.createElement("div", {
    className: "createButtonContainer"
  }, /*#__PURE__*/react.createElement(dist/* Link */.N_, {
    className: "btn createButton",
    to: "/create",
    onClick: openCreateModal
  }, /*#__PURE__*/react.createElement("img", {
    className: "plusButton",
    src: plus
  }), "Create")), /*#__PURE__*/react.createElement("div", {
    className: "titlesContainer"
  }, /*#__PURE__*/react.createElement("div", {
    className: "titlesNames"
  }, "Title"), /*#__PURE__*/react.createElement("div", {
    className: "titlesNames"
  }, "Description"), /*#__PURE__*/react.createElement("div", {
    className: "titlesNames"
  }, "Date")), /*#__PURE__*/react.createElement("div", {
    className: "tasksContainer"
  }, /*#__PURE__*/react.createElement("div", {
    className: "tasksContainer__scroller"
  }, tasks.map(task => /*#__PURE__*/react.createElement(Task, {
    key: task.id,
    task: task,
    mode: mode,
    onView: () => openViewModal(task),
    onEdit: () => openEditModal(task),
    onClone: cloneTask,
    onDelete: () => openRemoveModal(task)
  })))), /*#__PURE__*/react.createElement(Modal, {
    task: tasks.find(t => t.id === currentTaskId),
    mode: mode,
    onCreate: handleCreateTask,
    onSave: handleEditTask,
    onEdit: openEditModal,
    onRemove: handleDeleteTask,
    onClose: closeModal,
    onClone: cloneTask
  }));
};
;// CONCATENATED MODULE: ./src/App.jsx







const router = (0,dist/* createBrowserRouter */.Ys)([{
  path: "/:mode?",
  element: /*#__PURE__*/react.createElement(TaskBoard, null),
  errorElement: /*#__PURE__*/react.createElement(ErrorPage, null)
}]);
client/* createRoot */.H(document.getElementById("root")).render( /*#__PURE__*/react.createElement(react.StrictMode, null, /*#__PURE__*/react.createElement(GlobalStoreController, null, /*#__PURE__*/react.createElement(dist/* RouterProvider */.pg, {
  router: router
}))));

/***/ }),

/***/ 350:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/620989716c68066e2909.png";

/***/ }),

/***/ 603:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/4cde6cf6920bc0095507.svg";

/***/ }),

/***/ 422:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/9d0a515b853f811da4e9.svg";

/***/ }),

/***/ 374:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "images/4cb7e0fb3f3a87810f74.svg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			792: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunktaskboard"] = self["webpackChunktaskboard"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [483], () => (__webpack_require__(164)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
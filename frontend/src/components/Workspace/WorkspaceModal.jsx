import React, {useState, useEffect} from "react";

function WorkspaceModal({ 
  workspace, 
  employeeData, 
  addEmployeeToWorkspace, 
  deleteEmployeeFromWorkspace,
  blockWorkSpace, 
  unBlockWorkSpace,
  onClose, 
  show }) {

  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {// useEffect is to prevent to many rerenders
    if(employeeData.length > 0)
    {
      setSelectedOption(employeeData[0].userID); //default value for select list 
    }
  }, [employeeData]);
    
    const handleChange = (event) => {
      setSelectedOption(event.target.value);
    };

    return (
      <>
        {show ? (
          workspace.userID ? (
            <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 backdrop-filter backdrop-blur-sm">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
                onClick={onClose}
              >
                <div className="absolute inset-0 opacity-25 bg-gray-800" />
              </div>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full w-full">
                <div className="flex flex-row justify-between items-center p-4">
                  <h3 className="font-semibold text-gray-900 uppercase truncate">
                    Szczegóły stanowiska
                  </h3>
                 { workspace.isAvailable === 1 ? (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => blockWorkSpace(workspace.workspaceID)}
                  >
                    
                    Zgłoś Awarie
                  </button>
                  ) : (
                    <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => unBlockWorkSpace(workspace.workspaceID)}
                    >
                    
                      Anuluj Awarie
                    </button>
                  )}

                </div>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">Dostępni pracownicy</div>

                <div className="w-full max-w-xs mx-auto">
                  
                  <label className="block text-black text-sm font-bold mb-1">
                      Numer Stanowiska
                    </label>
                    <input 
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      defaultValue={workspace.workspaceNumber}
                      disabled
                    />

                    <label className="block text-black text-sm font-bold mb-1">
                      Pracownik
                    </label>
                    <input 
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      defaultValue={workspace.userName}
                      disabled
                    />

                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={onClose}
                  >
                    Zamknij
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {deleteEmployeeFromWorkspace(workspace.workspaceID); onClose()}}
                  >
                    Usuń pracownika ze stanowiska
                  </button>
                </div>
              </div>
            </div>
          </div>
          ):(
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 backdrop-filter backdrop-blur-sm">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                  onClick={onClose}
                >
                  <div className="absolute inset-0 opacity-25 bg-gray-800" />
                </div>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full w-full">
                  <div className="flex flex-row justify-between items-center p-4">
                    <h3 className="font-semibold text-gray-900 uppercase truncate">
                      Szczegóły stanowiska
                    </h3>

                    { workspace.isAvailable === 1 ? (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => blockWorkSpace(workspace.workspaceID)}
                  >
                    
                    Zgłoś Awarie
                  </button>
                  ) : (
                    <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => unBlockWorkSpace(workspace.workspaceID)}
                    >
                    
                      Anuluj Awarie
                    </button>
                  )}

                  </div>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">Dostępni pracownicy</div>

                  <div className="w-full max-w-xs mx-auto">
                    
                    <select
                      id="person"
                      value={selectedOption}
                      onChange={handleChange}
                      className="block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      {employeeData && employeeData.map((item, index) => (
                        <option key={index} value={item.userID}>{item.userName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={onClose}
                    >
                      Zamknij
                    </button>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {addEmployeeToWorkspace(parseInt(selectedOption), workspace.workspaceID); onClose()}}
                    >
                      Zapisz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : null}
      </>
    );
}

export default WorkspaceModal;

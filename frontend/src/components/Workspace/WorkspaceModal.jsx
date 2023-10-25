import React from "react";

function WorkspaceModal({ workspace, onClose, show }) {

    return (
      <>
        {show ? (
          <div 
            className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 bg-black bg-opacity-50" 
            onClick={onClose}
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl" onClick={e => e.stopPropagation()}>
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <p className="text-2xl font-semibold">Workspace Details</p>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={onClose}
                  >
                    <span className="opacity-7 h-6 w-6 text-xl block py-0 rounded-full">
                     <p className=" text-black font-bold text-2xl "> x </p>
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <form className="bg-white rounded px-8 pt-6 pb-8 w-full">
                    <label className="block text-black text-sm font-bold mb-1">
                      Workspace ID
                    </label>
                    <input 
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      defaultValue={workspace.workspaceID}
                      disabled
                    />
                    <label className="block text-black text-sm font-bold mb-1">
                      User ID
                    </label>
                    <input 
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      defaultValue={workspace.userID}
                      disabled
                    />
                    <label className="block text-black text-sm font-bold mb-1">
                      Workspace Number
                    </label>
                    <input 
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                      defaultValue={workspace.workspaceNumber}
                      disabled
                    />
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={onClose}
                  >
                    Zamknij
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
}

export default WorkspaceModal;

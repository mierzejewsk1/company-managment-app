import React, { useState } from 'react';
import WorkspaceModal from './WorkspaceModal';

function WorkspaceQubicle({ 
    workspace, 
    employeeData, 
    addEmployeeToWorkspace, 
    deleteEmployeeFromWorkspace, 
    displayAvailableEmployees, 
    blockWorkSpace, 
    unBlockWorkSpace }) {

    const [isFormVisible, setIsFormVisible] = useState(false);
    let backgroundColor = workspace.userID ? 'bg-gray-400' : 'bg-green-400';
    backgroundColor = workspace.isAvailable === 1 ? backgroundColor: 'bg-red-400';
    const handleClick = () => {
        displayAvailableEmployees();
        setIsFormVisible(true);
    };

    return (
        <>
            <article className={`
                w-[115px] h-[115px] 
                flex flex-col 
                md:justify-between 
                border-b border-l border-black 
                p-5 
                ${backgroundColor}
                hover:bg-white duration-200 cursor-pointer
            `}
            onClick={handleClick}
            >
                <div className="flex flex-col 2xl:flex-row justify-center">
                    <div className="flex flex-col">
                        <p className="mr-2 text-gray-500">NR</p>
                        <p>{workspace.workspaceID}</p>
                    </div>
                </div>
            </article>

            <WorkspaceModal 
                show={isFormVisible} 
                workspace={workspace} 
                employeeData={employeeData} 
                addEmployeeToWorkspace={addEmployeeToWorkspace} 
                deleteEmployeeFromWorkspace={deleteEmployeeFromWorkspace}
                blockWorkSpace={blockWorkSpace}
                unBlockWorkSpace={unBlockWorkSpace}
                onClose={() => setIsFormVisible(false)} 
            />
        </>
    );
}

export default WorkspaceQubicle;

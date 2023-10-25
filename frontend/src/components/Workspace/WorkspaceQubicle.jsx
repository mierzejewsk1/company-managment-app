import React, { useState } from 'react';
import WorkspaceModal from './WorkspaceModal';

function WorkspaceQubicle({ workspace }) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const backgroundColor = workspace.userID ? 'bg-gray-200' : 'bg-green-200';

    const handleClick = () => {
        setIsFormVisible(true);
        console.log(workspace.workspaceID);
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

            <WorkspaceModal show={isFormVisible} workspace={workspace} onClose={() => setIsFormVisible(false)} />
        </>
    );
}

export default WorkspaceQubicle;

import React, { Component } from 'react';
class ChooseProject extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };
    }
    render() {
        return (
            <div className="fixed z-10 inset-0 overflow-y-auto" id="headlessui-dialog-4" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div id="headlessui-dialog-overlay-6" aria-hidden="true" className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
                    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                        <div>
                            <h2 className="mb-6 text-3xl font-extrabold text-gray-900"> Choose Project </h2>
                            <form className="space-y-6">
                                <div>
                                    <label for="name" className="block text-sm font-medium text-gray-700"> Project name </label>
                                    <select id="Project" name="Project" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                        <option>Project A</option>
                                        <option selected>Project B</option>
                                        <option>Project C</option>
                                    </select>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"> Next </button>
                                    <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"> Cancel </button>
                                </div>
                                <div>
                                    <a className="underline text-sm text-gray-600 hover:text-gray-900" href="https://discover360.app/audiences/projects"> Create New Project? </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ChooseProject;
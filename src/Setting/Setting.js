import React, { Component } from 'react';
class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '', token: '' };
    }

    componentDidMount = () => {
        let token = window.localStorage.getItem('app-token');
        if (token) {
            this.setState({
                token: token
            })
        }
    }

    onChangeTokenInput = (event) => {
        console.log('evemt',event.target.value)
        this.setState({
            token: event.target.value
        })
    }

    onSubmitToken = () => {
        window.localStorage.setItem('app-token', this.state.token);
    }

    onRevokeToken = () => {
        this.setState({
            token: ''
        })
        window.localStorage.removeItem('app-token');
    }

    render() {
        return (
            <div className="h-screen flex bg-blue-gray-50 overflow-hidden">
                <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                    <main className="flex-1 flex overflow-hidden">
                        <div className="flex-1 flex flex-col overflow-y-auto xl:overflow-hidden">
                            <div className="flex-1 flex xl:overflow-hidden">

                                <nav aria-label="Sections" className="hidden flex-shrink-0 w-96 bg-white border-r border-blue-gray-200 xl:flex xl:flex-col">
                                    <div className="flex-shrink-0 h-16 px-6 border-b border-blue-gray-200 flex items-center">
                                        <p className="text-lg font-medium text-blue-gray-900">Settings</p>
                                    </div>
                                    <div className="flex-1 min-h-0 overflow-y-auto">
                                        {/* <!--Current: "bg-blue-50 bg-opacity-50", Default: "hover:bg-blue-50 hover:bg-opacity-50" --> */}
                                        <a href="#" className="bg-blue-50 bg-opacity-50 flex p-6 border-b border-blue-gray-200" aria-current="page">
                                            {/* <!--Heroicon name: outline/cog--> */}
                                            <svg className="flex-shrink-0 -mt-0.5 h-6 w-6 text-blue-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <div className="ml-3 text-sm">
                                                <p className="font-medium text-blue-gray-900">Account</p>
                                                <p className="mt-1 text-blue-gray-500">Manage Your Discover360 Desktop Settings</p>
                                            </div>
                                        </a>

                                        <a href="#" className="hover:bg-blue-50 hover:bg-opacity-50 flex p-6 border-b border-blue-gray-200">
                                            {/* <!--Heroicon name: outline/bell--> */}
                                            <svg className="flex-shrink-0 -mt-0.5 h-6 w-6 text-blue-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                            <div className="ml-3 text-sm">
                                                <p className="font-medium text-blue-gray-900">Notifications (Coming Soon)</p>
                                                <p className="mt-1 text-blue-gray-500">Manage Your Discover360 Notifications</p>
                                            </div>
                                        </a>
                                    </div>
                                </nav>

                                {/* <!--Main content--> */}
                                <div className="flex-1 max-h-screen xl:overflow-y-auto">
                                    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
                                        <h1 className="text-3xl font-extrabold text-blue-gray-900">Account</h1>

                                        <form className="mt-6 space-y-8 divide-y divide-y-blue-gray-200">
                                            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                                                <div className="sm:col-span-6">
                                                    <h2 className="text-xl font-medium text-blue-gray-900">Connect API</h2>
                                                    <p className="mt-1 text-sm text-blue-gray-500">Connect Your Discover360 API.<a href="#" className="text-indigo-600">Create One Here</a></p>
                                                </div>
                                            </div>
                                        </form>

                                        <div className="sm:col-span-3">
                                            <form className="space-y-6">
                                                <label for="name" className="block text-sm font-medium text-gray-700"> API Token </label>
                                                <div className="mt-1">
                                                    <input type="text" name="api" id="api" value={this.state.token} onChange={this.onChangeTokenInput} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Paste Your  API Token Here.." />
                                                </div>
                                                {/* <!----> */}
                                            </form>
                                        </div>
                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                            <button type="submit" onClick={this.onSubmitToken} className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"> Save </button>
                                            <button type="button" onClick={this.onRevokeToken} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"> Revoke </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}
export default Setting;
const { createApp, ref } = Vue
const { useToast } = primevue.usetoast
const { useConfirm } = primevue.useconfirm

const App = {
    
    setup() {
        const showNew = ref(false)
        const showEdit = ref(false)
        const hasErrors = ref(false)
        const hasEditErrors = ref(false)
        const codes = ref([])
        const description = ref('')
        const description_edit = ref('')
        const code = ref('')
        const code_edit = ref('')
        const id = ref(0)
        const toast = useToast()        
        const confirm = useConfirm()

        return {
            showNew, hasErrors, hasEditErrors, codes, description, description_edit, code, code_edit, id, 
            toast, showEdit, id, confirm
        }
    },
    components: {
        "p-button": primevue.button,
        "p-message": primevue.message,
        "p-dialog": primevue.dialog,
        "p-inputtext": primevue.inputtext,
        "p-column": primevue.column,
        "p-datatable": primevue.datatable,
        "p-toast": primevue.toast,
        "p-panel": primevue.panel,
        "p-dropdown": primevue.dropdown,
        "p-confirmdialog": primevue.confirmdialog,
        "p-textarea": primevue.textarea
    },    
    methods: {
        save() {
            if(this.description.trim() === '' || this.code.trim() === '') {
                this.hasErrors = true
            }
            else {
                const storage = localStorage.getItem("codes")
                let index = 1
                if(storage !== null) {                    
                    index = JSON.parse(storage).length + 1
                }
                const code = {
                    id: index,
                    description: this.description,                    
                    code: this.code
                }
                this.codes.push(code)
                localStorage.setItem("codes", JSON.stringify(this.codes))
                this.toast.add({ severity: "success", summary: "Message", detail: "Code was saved successfully", life: 3000 })
                this.clearNewFields()
            }
        },
        closeMessage() {
            alert('')
        },
        edit(id) {
            this.showEdit = true
            const codeEdit = this.codes.find((code) => code.id === id)
            this.id = id
            this.description_edit = codeEdit.description
            this.code_edit = codeEdit.code
        },
        update() {
            if(this.description_edit.trim() === '' || this.code_edit.trim() === '') {
                this.hasEditErrors = true
            }
            else {
                this.codes.map(code => {
                    if(code.id === this.id) {
                        code.description = this.description_edit
                        code.code = this.code_edit
                        localStorage.setItem("codes", JSON.stringify(this.codes))
                        this.showEdit = false
                        this.toast.add({ severity: "info", summary: "Message", detail: "Code was updated successfully", life: 3000 })
                        this.clearEditFields()
                    }
                })
            }
        },
        clearNewFields() {
            this.description = ''
            this.code = ''
            this.hasErrors = false
            this.showNew = false
        },
        clearEditFields() {
            this.id = 0
            this.description_edit = ''
            this.code_edit = ''
            this.hasEditErrors = false
            this.showEdit = false
        },
        deleteRow(id) {
            this.confirm.require({
                message: 'Do you really want to delete this code?',
                header: 'Delete ',
                icon: 'pi pi-info-circle',
                rejectLabel: 'Cancel',
                acceptLabel: 'Delete',
                rejectClass: 'p-button-secondary p-button-outlined',
                acceptClass: 'p-button-danger',
                accept: () => {
                    this.codes = this.codes.filter(code => code.id !== id)
                    localStorage.setItem("codes", JSON.stringify(this.codes))
                    this.toast.add({ severity: "error", summary: "Message", detail: "Code was deleted successfully", life: 3000 })
                },
                reject: () => {
                }
            })
        }
    },
    mounted() {
        const storage = localStorage.getItem("codes")
        if(storage !== null) {
            this.codes = JSON.parse(storage)
        }
    }
}

createApp(App)
    .use(primevue.config.default)
    .use(primevue.toastservice)
    .use(primevue.confirmationservice)
    .mount("#app")
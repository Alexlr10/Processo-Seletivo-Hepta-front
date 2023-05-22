<template>
    <div class="home">
        <Toast />
        <h1>Funcionários</h1>

        <div style="display: flex; align-items: center; margin: 10px 0px;">
            Foram carregados {{ funcionarios.length }} itens
            <span class="botaoAcao"><Button label="Novo Funcionário" @click.prevent="mostraDialogFuncionario()"
                    icon="pi pi-plus" class="p-button-rounded p-button-sm" /></span>
            <span class="botaoAcao"><Button label="Atualizar Dados" @click.prevent="atualizaListaFuncionarios()"
                    icon="pi pi-refresh" class="botaoAcao p-button-rounded p-button-sm" /></span>
        </div>

        <DataTable :value="funcionarios" responsiveLayout="scroll" autoLayout="true" class="p-datatable-sm">
            <Column field="id" header="Id" />
            <Column field="nome" header="Nome" />
            <Column field="dataNascimento" header="Data Nascimento">
                <template #body="slotProps">
                    {{ formatarData(slotProps.data.dataNascimento) }}
                </template>
            </Column>
            <Column field="cpf" header="CPF" />
            <Column field="email" header="E-Mail" />
            <Column field="lotacao.label" header="Lotacao">

            </Column>
            <!-- coluna com o botão de alteração do registro sendo mostrado na linha -->
            <Column field="id" header="Alterar">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-sm"
                        @click.prevent="mostraDialogAlterarFuncionario(slotProps.data.id)" />
                </template>
            </Column>
            <Column field="id" header="Excluir">
                <template #body="slotProps">
                    <Button icon="pi pi-minus" class="p-button-rounded p-button-sm"
                        @click.prevent="funcionarioSelecionado = slotProps.data; $refs.modalConfirmacaoExclusao.abrirModal()" />
                </template>
            </Column>
        </DataTable>

        <ConfirmacaoExclusao :funcionario="funcionarioSelecionado" @excluir-funcionario="excluirFuncionario"
            ref="modalConfirmacaoExclusao"></ConfirmacaoExclusao>

        <Dialog header="Novo Funcionário" modal="true" :visible.sync="mostraFuncionario"
            :contentStyle="{ overflow: 'visible' }" :containerStyle="{ width: '50vw' }">
            <NovoFuncionario :funcionario-selecionado="funcionarioSelecionado"
                @funcionario-salvo="mostraFuncionario = false" @carrega-funcionarios="this.carregaFuncionarios"
                @show-Toast="this.showToast" />
        </Dialog>

    </div>
</template>

<script>


import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import NovoFuncionario from './Funcionario.vue';
import ConfirmacaoExclusao from './ModalConfirmacaoExclusao.vue';
import Toast from 'primevue/toast';

export default {

    name: 'Home',

    data() {
        return {

            // Lista de funcionários a mostrar 
            funcionarios: [],
            funcionarioSelecionado: {
                nome: '',
                dataNascimento: null,
                cpf: '',
                email: '',
                lotacao: {
                    label : null,
                    value : null
                },
                //lotacao: ''
            },
            lotacoes: [
                { label: 'GPC', value: 1 },
                { label: 'GES', value: 2 },
                { label: 'GEFIN', value: 3 },
                { label: 'GOV', value: 4 }
            ],
            //lotacao: null,
            mostraFuncionario: false
        }
    },

    // ---
    // Evento executado na inicialização deste componente
    // ---
    async mounted() {
        await this.carregaFuncionarios();
    },

    // ---
    // Métodos do componente
    // ---
    methods: {

        atualizaLabelsLotacao() {
            this.funcionarios.forEach(funcionario => {
                const lotacao = this.lotacoes.find(item => item.value === funcionario.idLotacao);
                funcionario.lotacao = lotacao ? lotacao : null;
            });
        },

        atualizaListaFuncionarios() {
            this.carregaFuncionarios();
            this.showToast("success", "Lista de funcionarios atualizada com sucesso!!!", null);
        },

        showToast(severity, message, detail) {
            this.$toast.add({ severity: severity, summary: message, detail: detail, life: 3000 });
        },

        formatarData(dataNascimento) {
            if (dataNascimento) {
                const data = new Date(dataNascimento);
                const dia = String(data.getDate()).padStart(2, '0');
                const mes = String(data.getMonth() + 1).padStart(2, '0'); // Os meses são baseados em zero
                const ano = data.getFullYear();
                return `${dia}/${mes}/${ano}`;
            }
            return '';
        },

        // ---
        // Carrega a lista de funcionários
        // ---
        async carregaFuncionarios() {
            try {
                console.log(this.$urlApi)
                // Chamada à API de carga dos dados
                var result = await this.$http.get(this.$urlApi + "/Funcionarios");
                this.funcionarios = result.data;
                this.atualizaLabelsLotacao();
            }
            catch (err) {
                this.showToast("error", err.response.data, null);
            }
        },

        // ---
        // Faz aparecer a dialog box de inclusão de novo funcionário
        // ---
        mostraDialogFuncionario() {
            this.mostraFuncionario = true;
        },

        // ---
        // Faz aparecer a dialog box de edição de funcionário
        // ---
        async mostraDialogAlterarFuncionario(idFuncionario) {
            var result = await this.$http.get(this.$urlApi + "/Funcionarios/" + idFuncionario);
            this.funcionarioSelecionado = result.data;
            this.funcionarioSelecionado.lotacao = this.lotacoes.find(item => item.value === this.funcionarioSelecionado.idLotacao) || null;
            this.mostraDialogFuncionario();
        },

        async excluirFuncionario(id) {
            try {
                await this.$http.delete(this.$urlApi + "/Funcionarios/" + id);
                this.carregaFuncionarios();
                this.showToast("success", "Funcionário excluido com sucesso!", null);
            } catch (err) {
                this.showToast("error", err.response.data, null);
            }
        }

    },

    components: { DataTable, Column, Button, Dialog, NovoFuncionario, ConfirmacaoExclusao, Toast },

    watch: {
        mostraFuncionario(newVal) {
            if (!newVal) {
                this.funcionarioSelecionado = {};
            }
        }
    },
};
</script>

<style>
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 0px 50px;
}

h1 {
    font-size: 70px;
    font-weight: 600;
}

.botaoAcao {
    margin-left: 10px;
}
</style>
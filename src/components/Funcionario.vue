<template>
    <div style="width: 100%">
        <div class="campoForm">
            <span class="p-float-label">
                <InputText id="nome" type="text" v-model="funcionario.nome" style="width:70%" />
                <label for="nome">Nome</label>
            </span>
        </div>
        <div class="campoForm">
            <span class="p-float-label">
                <Calendar id="dataNascimento" v-model="data" style="width:70%" dateFormat="dd/mm/yy"
                    :inputFormat="inputFormat" />
                <label for="dataNascimento">Data de Nascimento</label>
            </span>
        </div>
        <div class="campoForm">
            <span class="p-float-label">
                <InputText id="cpf" type="text" v-model="funcionario.cpf" style="width:70%" />
                <label for="nome">CPF</label>
            </span>
        </div>
        <div class="campoForm">
            <span class="p-float-label">
                <InputText id="email" type="text" v-model="funcionario.email" style="width:70%" />
                <label for="nome">E-Mail</label>
            </span>
        </div>
        <div class="campoForm">
            <span class="p-float-label">
                <Dropdown id="idLotacao" v-model="funcionario.lotacao" :options="lotacoes" style="width:70%" optionLabel="label" />
                <label for="idLotacao">Lotação</label>
            </span>
        </div>

        <div class="campoForm">
            <span class="botaoAcao">
                <Button icon="pi pi-check" class="p-button-raised p-button-rounded p-button-sm da-ed" label="Salvar"
                    @click="salvarFuncionarioOuEditar()" />
            </span>
        </div>
    </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';


export default {
    props: ['funcionarioSelecionado'],

    data() {
        return {
            funcionario: {
                nome: '',
                dataNascimento: null,
                cpf: '',
                email: '',
                idLotacao: null,
                lotacao: null
            },
            lotacoes: [
                { label: 'GPC', value: 1 },
                { label: 'GES', value: 2 },
                { label: 'GEFIN', value: 3 },
                { label: 'GOV', value: 4 }
            ],
            data: null,
        }
    },

    mounted() {
        this.funcionario = { ...this.funcionarioSelecionado } || this.funcionario;
        this.data = this.formatarData(this.funcionario.dataNascimento || Date.now());
        this.lotacao = this.lotacoes.find(lotacao => lotacao.value === this.funcionario.idLotacao);
    },

    methods: {

        formatarData(dataNascimento) {
            // Converter para o formato desejado
            const data = new Date(dataNascimento);
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0'); // Os meses são baseados em zero
            const ano = data.getFullYear();
            return `${dia}/${mes}/${ano}`;
        },

        converterDataFormatoBanco(dataNascimento) {
            // Verificar se a data já está no formato desejado
            const formatoEsperado = /^\d{2}\/\d{2}\/\d{4}$/;
            if (formatoEsperado.test(dataNascimento)) {
                // Desfazer a formatação e retornar a data original
                const partes = dataNascimento.split('/');
                const dia = parseInt(partes[0], 10);
                const mes = parseInt(partes[1], 10) - 1; // Os meses são baseados em zero
                const ano = parseInt(partes[2], 10);
                const dataOriginal = new Date(ano, mes, dia);
                return dataOriginal;
            }
            return dataNascimento;
        },

        async salvarFuncionarioOuEditar() {
            if (this.funcionario.id) {
                // Executar função de editar
                this.editarFuncionario(this.funcionario.id);
            } else {
                // Executar função de salvar
                this.salvarFuncionario();
            }
        },

        async salvarFuncionario() {
            try {
                this.funcionario.dataNascimento = this.converterDataFormatoBanco(this.data);
                this.funcionario.idLotacao = this.funcionario.lotacao.value;
                delete this.funcionario.lotacao;
                await this.$http.post(this.$urlApi + "/Funcionarios", this.funcionario);
                this.$emit('carrega-funcionarios');
                this.$emit('funcionario-salvo');
                this.$emit('show-Toast', "success", "Novo funcionário salvo com sucesso!", null);
            } catch (err) {
                this.$emit('show-Toast', "error", err.response.data, null);
            }
        },

        async editarFuncionario(id) {
            try {
                this.funcionario.dataNascimento = this.converterDataFormatoBanco(this.data);
                this.funcionario.idLotacao = this.funcionario.lotacao.value;
                delete this.funcionario.lotacao;
                await this.$http.put(this.$urlApi + "/Funcionarios/" + id, this.funcionario);
                this.$emit('carrega-funcionarios');
                this.$emit('funcionario-salvo');
                this.$emit('show-Toast', "success", "Funcionário editado com sucesso!", null);
            } catch (err) {
                this.$emit('show-Toast', "error", err.response.data, null);
            }
        }
    },

    components: { InputText, Calendar, Button, Dropdown }
}
</script>

<style scoped>
.campoForm {
    margin-top: 30px;
    width: 100%;
}
</style>

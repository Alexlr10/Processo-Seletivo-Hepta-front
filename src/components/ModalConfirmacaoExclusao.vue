<template>
    <Dialog header="Excluir Funcionário" :visible.sync="mostraModal" modal="true" :baseZIndex="2000" :appendTo="body"
        @hide="fecharModal" :contentStyle="{ overflow: 'visible' }" :containerStyle="{ width: '50vw' }">
        <h3>Deseja excluir o funcionário {{ this.funcionario.nome }} ?</h3>
        <div class="p-dialog-footer">
            <Button label="Cancelar" @click="fecharModal" class="p-button-secondary" />
            <Button label="Confirmar" @click="excluirFuncionario" class="p-button-danger" />
        </div>
    </Dialog>
</template>
  
  
<script>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

export default {
    name: 'ModalConfirmacaoExclusao',
    props: {
        funcionario: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            mostraModal: false
        };
    },
    components: {
        Dialog,
        Button
    },
    methods: {
        abrirModal() {
            this.mostraModal = true;
        },
        fecharModal() {
            this.mostraModal = false;
        },
        excluirFuncionario() {
            this.$emit('excluir-funcionario', this.funcionario.id);
            this.fecharModal();
        },
    }
};
</script>
  
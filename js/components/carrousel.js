import tpl from '../utils/avecTemplateHtml.js'

export default tpl({
    template: 'components/carrousel.html',
    props: [
        'id',
        'title',
        'url',
        'thumbnail',
        'permalink',
        'author',
        'index'
    ],
    data() {
        return {
            estActif: false,
        }
    },
    mounted() {
        if(this.$parent.activePostIndex == this.index) {
            this.estActif = !this.estActif;
        }
    },
    updated() {
        // Lors de l'appel de selectionImage(), recevoir changement d'état
        this.$root.$on('toggleActif', (index) => {
            // Si miniature n'est pas celle cliquée ET si miniature actif, la désactiver
            if (this.index != index && this.estActif) {
                this.estActif = !this.estActif
            }
        })  
    },
    computed: {
        postActifIndex() {
            return this.$parent.activePostIndex
        }
    },
    methods: {
        selectionImage(index) {
            // Si miniature inactive, changer son status et transmettre index au parent
            if (!this.estActif) {
                this.$emit('imageselectionnee', this.index)
                this.estActif = !this.estActif
            }
            // Informer les autres miniatures d'un changement
            this.$root.$emit('toggleActif', index)
        },
    },
    watch: {
        postActifIndex() {
        }
    },
})
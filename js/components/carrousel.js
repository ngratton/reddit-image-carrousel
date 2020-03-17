import tpl from '../utils/avecTemplateHtml.js'

export default tpl({
    template: 'components/carrousel.html',
    // props: ['post', 'id'],
    props: [
        'id',
        'title',
        'url',
        'thumbnail',
        'permalink',
        'author',
    ],
    data() {
        return {
            estActif: false,
        }
    },
    mounted() {
        this.id = this.$props.id
        
    },
    updated() {
        // Lors de l'appel de selectionImage(), recevoir changement d'état
        this.$root.$on('toggleActif', (id) => {
            // Si miniature n'est pas celle cliquée ET si miniature actif, la désactiver
            if (this.id != id && this.estActif) {
                this.estActif = !this.estActif
            }
        })  
    },
    methods: {
        selectionImage(id, index) {
            // Si miniature inactive, changer son status et transmettre Obj.post au parent
            if (!this.estActif) {
                this.$emit('imageselectionnee', this.post)
                this.estActif = !this.estActif
            }
            // Informer les autres miniatures d'un changement
            this.$root.$emit('toggleActif', id )
        },
    }
})
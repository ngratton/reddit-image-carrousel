/**
 * ##########################
 * Nicholas Gratton (0270256)
 * ##########################
 * 
 * Bug connu: Certaines images hébergées sur IMGUR ne s'affichent pas dans le
 * navigateur parce qu'ils ne permettent pas d'être loadé depuis "localhost"
 * 
 * Projet en ligne : https://ngratton.github.io/reddit-images-carrousel/
 * 
 */

import carrousel from './components/carrousel.js'

let app = new Vue({
    el: '#app',
    data: {
        activeImg: '',
        subreddits: ['UnixPorn', 'AlbumArtPorn', 'BikePorn', 'EarthPorn'],
        postsList: [],
        activePost: {
            url: './img/loading.gif'
        },
        activePostIndex: '',
        subsToFetch: []
    },
    components: {
        carrousel,
    },
    created() {
        this.getPosts().then(this.randomPost)
        this.navigatePostsWithArrows()
    }, // created
    mounted() {
    }, // mounted
    methods: {
        getPosts() {
            return new Promise((resolve) => {
                Promise.all(this.fetchFromSubsList()).then(values => {
                    for(let i = 0; i < values.length; i++) {
                        values[i].json().then(data => {
                            this.pushPostsToPostsList(data)
                        })

                        if(i === values.length - 1) {
                            return resolve('Succès!')
                        }
                    }
                })
            })
        },
        fetchFromSubsList() {
            let fetchList = []
            for(let i = 0; i < this.subreddits.length; i++) {
                fetchList[i] = fetch(`https://www.reddit.com/r/${this.subreddits[i]}.json?limit=30`)
            }
            return fetchList
        },
        pushPostsToPostsList(data) {
            let posts = data.data.children
            const NONTHUMB = ['nsfw', 'self', 'default']
            posts.forEach(post => {
                post = post.data
                if(!NONTHUMB.includes(post.thumbnail)) {
                    this.postsList = this.postsList.sort(function() { return 0.5 - Math.random() })
                    return this.postsList.push(post)
                }
            })
        },
        randomPost() {
            this.activeImg = './img/loading.gif'
            // J'ai essayé avec des promesses; j'ai fait un refactor intense (en améliorant de ±10 lignes),
            // mais je n'ai pas réussi à avoir le .length de mon tableau sans un court délai, d'où le setTimeout
            setTimeout(() => { 
                let randPost = Math.floor(Math.random() * this.postsList.length + 1)
                this.activePost = this.postsList[randPost]
                this.activePostIndex = randPost
                this.activeImg = this.activePost.url
                this.scrollToActive(randPost)
            }, 200)
        },  // randomPost
        selectionPost(index) {
            this.activePost = this.postsList[index]
            this.activeImg = './img/loading.gif'
            this.activePost.index = index
            this.activePostIndex = index
            this.scrollToActive(index)
        }, // selectionPost
        scrollToActive(index) {
            let carrousel = document.querySelector('.scroll-container')
            let halfScreenWidth = carrousel.clientWidth / 2 - 60
            let miniatureWidth = 120 
            let largeurAScroller = (miniatureWidth * index)
            carrousel.style.left = `${0 - largeurAScroller + halfScreenWidth}px`
        }, // scrollToActive
        imgLoad() {
            this.activeImg = this.activePost.url
        },  // imgLoad
        navigatePostsWithArrows() {
            window.addEventListener('keyup', e => {
                if(e.key === 'ArrowLeft') {
                    let position = this.activePostIndex
                    this.naviguerGauche(position)
                }
                if(e.key === 'ArrowRight') {
                    let position = this.activePostIndex
                    this.naviguerDroite(position)
                }
            })
        },  // navigatePostsWithArrows
        naviguerGauche(position) {
            if (position > 0) {
                position = position - 1
                this.selectionPost(position)
                this.activePostIndex = position
            }
        }, //naviguerGauche
        naviguerDroite(position) {
            let max = this.postsList.length - 1
            if(position < max) {
                position = position + 1
                this.selectionPost(position)
                this.activePostIndex = position
            }
        }, //naviguerDroite
    }, 
})

window.app = app
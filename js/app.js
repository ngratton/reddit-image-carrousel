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
import { http_get } from './utils/request.js'

let app = new Vue({
    el: '#app',
    data: {
        // subreddits: ['itsaunixsystem'],
        subreddits: ['UnixPorn', 'AlbumArtPorn', 'BikePorn', 'EarthPorn'],
        postsList: [],
        activePost: {},
        activeImage: './img/loading.gif',
        activePostIndex: '',
    },
    components: {
        carrousel,
    },
    created() {
        this.activeImage = './img/loading.gif'
        this.loopSubsList(this.subreddits).then(() => {
            setTimeout(()=> {
                let randNumber = Math.floor(Math.random() * this.postsList.length)
                this.randomPost(randNumber)
            }, 1000)
            this.navigatePostsWithArrows()
        })
    }, // created
    mounted() {
    }, // mounted
    methods: {
        loopSubsList(subs) {
            return new Promise((resolve, reject) => {
                subs.forEach(sub => {
                    this.getPosts(sub)
                })
                resolve()
                reject( Error('Sa marche pô.') )
            })
        },
        getPosts(sub) {
            const NONTHUMB = ['nsfw', 'self', 'default']
            return this.fetchSubPosts(sub, []).then(data => {
                // console.log(data)
                
                // return this.postsList.push(data)
                data.forEach(post => {
                    post = post.data
                    if(!NONTHUMB.includes(post.thumbnail)) {
                        return this.postsList.push(post)
                    }
                    this.postsList = this.postsList.sort(function() { return 0.5 - Math.random() })
                })

            })
        },  // getPosts
        fetchSubPosts(sub, resultats) {
            return http_get(`https://www.reddit.com/r/${sub}/hot.json?limit=30`).then(donnees => {
                return resultats = resultats.concat(donnees.data.children)
            })
        }, // fetchSubPosts
        randomPost(postNo) {
            this.activePost = this.postsList[postNo]
            this.activePostIndex = postNo
            this.activeImage = this.activePost.url
            this.scrollToActive(postNo)
        },  // randomPost
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
        selectionPost(index) {
            this.activePost = this.postsList[index]
            this.activeImage = './img/loading.gif'
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
            this.activeImage = this.activePost.url
        }  // imgLoad
    }, 
})

window.app = app
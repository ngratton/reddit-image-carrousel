import carrousel from './components/carrousel.js'
import { http_get } from './utils/request.js'

let app = new Vue({
    el: '#app',
    data: {
        subreddits: ['UnixPorn'],
        // subreddits: ['UnixPorn', 'AlbumArtPorn', 'BikePorn', 'EarthPorn'],
        postsList: [],
        activePost: {
            url: '',
            title: '',
            author: '',
            subreddit: '',
            permalink: '',
        },
        activePostIndex: '',
    },
    components: {
        carrousel,
    },
    mounted() {
        this.activePost.url = './img/loading.gif'
        this.getPosts().then(() => {
            // this.postsList = Array.from(this.postsList)
            console.log(typeof Array.from(this.postsList));
            
            this.navigatePostsWithArrows()
            this.randomPost()
        })
    },
    methods: {
        getPosts() {
            const nonThumb = ['nsfw', 'self', 'default']
            return new Promise((resolve, reject) => {
                resolve(
                    this.subreddits.forEach(sub => {
                        this.fetchSubPosts(sub, []).then(data => {
                            this.postsList.push(data)
                            
                            // data.forEach(post => {
                            //     if(!nonThumb.includes(post.data.thumbnail)) {
                            //         let postValide = new Object()
                            //         postValide.url = post.data.url
                            //         postValide.title = post.data.title
                            //         postValide.thumbnail = post.data.thumbnail
                            //         postValide.author = post.data.author
                            //         postValide.subreddit = post.data.subreddit
                            //         postValide.permalink = post.data.permalink
                            //         postValide.id = post.data.id
                            //         return this.postsList.push(postValide)
                            //     }
                            // })
                            // this.postsList = this.postsList.sort(function() { return 0.5 - Math.random() })
                        })
                    })
                )
            })
        },
        fetchSubPosts(sub, resultats) {
            return http_get(`https://www.reddit.com/r/${sub}/hot.json?limit=30`).then(donnees => {
                let posts = donnees.data.children
                return resultats = resultats.concat(posts)
            })
        },
        selectPost(post, index) {
            this.chargementImage(post)
            this.activePostIndex = index
            this.activePost.url = post.url
            this.activePost.title = post.title
            this.activePost.author = post.author
            this.activePost.subreddit = post.subreddit
            this.activePost.permalink = `https://www.reddit.com${post.permalink}`
        },
        chargementImage(post) {
            let image = document.querySelector('#image-principale')
            const loadgif = './img/loading.gif'
            this.postImageUrl = loadgif
            // this.postImageUrl = post.url
        },
        randomPost() {
            this.activePost = {
                url: 'https://i.redd.it/jff6yatbrym41.jpg',
                title: 'Lorem Ipsum',
                author: 'De Vinci',
                subreddit: 'r/SuperDuper',
                permalink: '/r/pics'
            }
        },
        navigatePostsWithArrows() {
            window.addEventListener('keyup', e => {
                if(e.key === 'ArrowLeft') {
                    console.log(e.key)
                }
                if(e.key === 'ArrowRight') {
                    console.log(e.key)
                }
            })
        },
    }, 
})

window.app = app
var Router = require('routes')
var router = Router()
var qs = require('qs')

// noop error handler, modify by using `route.setErrorHandler(func)`
var errorHandler = function(){}

module.exports = route

// Turbolinks fires a page:change event on the document
document.addEventListener('page:change', function(){
  // Delay is for redirections...
  setTimeout(function(){
    callHandlerFromMatch(router.match(window.location.pathname))
  }, 25)
})

function route(){
  router.addRoute.apply(router, arguments)
}

route.setErrorHandler = function setErrorHandler(fn){
  errorHandler = fn
}

function buildNextFromMatch(match){
  var next = match.next()
  if (!next) return handleNextError

  return function(error){
    if (error) return handleNextError(error)
    callHandlerFromMatch(next)
  }
}

function handleNextError(error){
  if (!error) return
  if (!(error instanceof Error))
    throw "Passed error needs to be an instance of Error"

  errorHandler(error)
}

function buildContextFromMatch(match) {
  return {
    params: match['params'],
    splats: match['splats'],
    query: location.search ? qs.parse(location.search.slice(1)) : {}
  }
}

function callHandlerFromMatch(match) {
  if (!match) return
  match.fn.call(null, buildContextFromMatch(match), buildNextFromMatch(match))
}

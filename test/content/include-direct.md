## Including

Parts of the page can be separated in different files. 

There is two ways to include these:

- direct include
  Content will immediately inserted when the whole page is loaded.
- lazy include
  Content will be inserted when it comes to visiblity in the displayed 'frame'

## Direct include

A direct include is done by several possible html-tags having the attribute <code>load</code> with adressing the content
to be included.  

<div class="code">
  &lt;div load="/path/to/include.html"&gt;&lt;/div&gt;
</div>

One of the possible tags is:

These are declared at <code>loader.js</code> at the variable <code>scanableTags</code>:   
<code>div</code>, <code>article</code>, <code>header</code>, <code>main</code>, <code>footer</code>, <code>aside</code>.

<div load="/content/include-lazy.md" lazy class="mt-1"></div>
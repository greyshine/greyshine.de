## Lazy including

Adding the extra aatribute <code>lazy</code> lets load the content when in viewport instead of direct loading.

<div class="code">
  &lt;div load="/path/to/include.html" lazy&gt;&lt;/div&gt;
</div>

It may also be set as attribute like <code>lazy="lazy"</code>.  
<span class="warn">Be cautions!</span> But it may not be <code>lazy="false"</code>. 

<header id="header"></header>

<div id="graph"></div>

<button class="js-btn">shuffle</button>
<button class="js-reco-btn">favorize</button>

<div id="foods"></div>


<script type="foo/bar" id="graph-tpl">
    <table class="table">
    <tbody>
    <% _.each(data, function(item) { %>
      <tr>
        <td class="name"><%=  item.name  %></td>
        <td class="value"><div class="bar post" style="width: <%=  item.value*10  %>%"></div></td>
      </tr>
    <% });  %>
    </tbody>
</table>
</script>

<script type="foo/bar" id='header-tpl'>
    <h4><%=  title  %></h4>
</script>

<script type="foo/bar" id='foods-tpl'>
    <ul>
    <% _.each(foods,function(food) { %>
        <li>
        <%=  food  %>
        </li>
    <% });  %>
    </ul>
</script>

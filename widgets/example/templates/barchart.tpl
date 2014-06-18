<h4><%=  title  %></h4>
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

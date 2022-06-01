using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace northwindmysql.Models
{
    public partial class Warehouseproduct
    {
        public int WarehouseId { get; set; }
        public int ProductId { get; set; }
        public short UnitsInStock { get; set; }
        public short UnitsOnOrder { get; set; }
        public short ReorderLevel { get; set; }
        public sbyte Discontinued { get; set; }
        
        [JsonIgnore]
        public virtual Product? Product { get; set; } = null!;
        [JsonIgnore]
        public virtual Warehouse? Warehouse { get; set; } = null!;
    }
}
